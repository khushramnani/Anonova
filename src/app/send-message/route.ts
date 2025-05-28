import dbConnect from "@/lib/dbConnect";
import UserModal, { Message } from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod/v4";


const validateMessageQuerySchema = z.object({
    validateMessage: messageSchema
})


export async function POST(req:Request) {
    await dbConnect()

    const { username , content } = await req.json()

        const checkMessageValidation = validateMessageQuerySchema.safeParse({validateMessage: content})

    if (!checkMessageValidation.success) {
         return Response.json({
               success: false,
               message: checkMessageValidation.error?.format().validateMessage?._errors || "Invalid OTP"
            },{status:401})
    }

    const user = await UserModal.findOne({
        username
    }).exec()

    if (!user) {
        return Response.json({
               success: false,
               message: "User Not Found"
            },{status:404})
    } 
    
    if (!user.isAcceptMessaging) {
        return Response.json({
               success: false,
               message: "User Is Not Accepting Message Right Now"
            },{status:401})
    }

    const newMessage: Message = {
        content: checkMessageValidation.data.validateMessage.content,
        createdAt: new Date(),
       
    } as Message;
    console.log("content: ",content);
    
    user.messages.push(newMessage)
    await user.save()

     return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );



}