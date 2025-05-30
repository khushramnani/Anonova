import UserModal from "@/models/User";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import { success } from "zod/v4";


const usernameQuerySchema = z.object({
    username : usernameValidation,
})

export async function GET(req:Request) {
    
    await dbConnect()
console.log("usernameValidation is", typeof usernameValidation);
    try {
        const {searchParams} = new URL(req.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        // http://localhost:5173/api/check-username/username?khush 

        const result = usernameQuerySchema.safeParse(queryParams) // validation checked by zod
        console.log("result",result)
        
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query parameter"
            },{
                status:401
            })
        }

        const {username} = result.data

        const checkExistingUsername = await UserModal.findOne({
            username,
            isVerified:true
        })

        if (checkExistingUsername) {
            return Response.json({
                success:false,
                message: "Username Already Exists or not verified"
            },{
                status:400
            })
        }

        return Response.json({
            success: true,
            message: "Username Is Unique"
        },{
            status:200
        })
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error checking username"
        },{
            status:500
        })
    }

}