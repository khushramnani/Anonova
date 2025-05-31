import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcrypt";


// import { sendVerificationEmail } from "@/helpers/sendEmail";
import { sendVerificationEmail } from "@/helpers/sendEmail-nodemailer";

export async function POST(request:Request) {
    await dbConnect()

    try {

        const {username , email , password} = await request.json()

        const existingUserByUsername = await UserModal.findOne({
            username,
            isVerified:true
        })

        if (existingUserByUsername) {
            return Response.json({
                success:false,
                message:"Username Already Exists"
            },{
                status:400
            })
        } 

        const existingUserByEmail = await UserModal.findOne({email})
        const sendVerifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                success:false,
                message:"Your Email Is already verified plz do SignIn "
            },{
                status:400
            })
            } else {
                const hashedpassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedpassword
                existingUserByEmail.verifyCode =  sendVerifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save()
            }
        } else {
            const hashedpassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModal({
                username,
                email,
                password: hashedpassword,
                verifyCode: sendVerifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptMessaging: true,
                messages: []
                
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(
            username,
            email,
            sendVerifyCode
        )

        if (!emailResponse) {
            return Response.json({
                success:false,
                message: "Failed to send verification email"
            },{status:500})
        }

         return Response.json({
                success:true,
                message: "Otp send Succesfully plz verify your email"
            },{status:200})

        
    } catch (error) {
        console.log("Error Registering user",error);
        return Response.json({
            success: false,
            message:"Error Registering user",
        },
        {
            status:500
        }
    
    )
        
        
    }
}

