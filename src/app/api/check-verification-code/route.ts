import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import {success, z} from "zod/v4";
import { verifySchema } from "@/schemas/verifySchema";



const verifyCodeQuerySchema = z.object({
    verifyCode : verifySchema
})

export async function POST(req:Request) {
    await dbConnect()

    try {
        const { username , code } = await req.json()
    
        const decodedUsername = decodeURIComponent(username)
    
        const user = await UserModal.findOne({
            username : decodedUsername
        })
    
        if (!user) {
            return Response.json({
                success:false,
                message:"User Not Found"
            },{
                status:401
            })
        }
    
        const codeValidation = verifyCodeQuerySchema.safeParse({ verifyCode: code })
    
        if (!codeValidation.success) {
            return Response.json({
               success: false,
               message: codeValidation.error?.format().verifyCode?._errors || "Invalid OTP"
            },{status:401})
        }
    
        const verifyCode = user.verifyCode == code
        const VerifyCodeExpiry = new Date(user.verifyCodeExpiry) > new Date()
    
    
        if (verifyCode && VerifyCodeExpiry) {
    
            user.isVerified = true
            await user.save()
            
            return Response.json({
               success: true,
               message:"Verification Succesfully"
            },{status:200})
        } else if (!VerifyCodeExpiry) {
            return Response.json({
               success: true,
               message:"Verification Code is expired plz resend the code and try again"
            },{status:200})
        } else {
             return Response.json({
               success: false,
               message:  "Verification Code Does not match"
            },{status:400})
        }
    
    } catch (error) {
        console.log("error in verification-code",error);
         return Response.json({
               success: false,
               message:  "Error on checking verification code"
            },{status:500})
    }
    
}