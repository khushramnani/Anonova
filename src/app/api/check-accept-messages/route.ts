import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { z } from "zod";

const acceptQuerymessageSchema = z.object({
  acceptMessages: z.boolean(),
});

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated, please login",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const body = await req.json();

  const validation = acceptQuerymessageSchema.safeParse(body);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.format());
    return Response.json(
      {
        success: false,
        message: "Invalid data",
        errors: validation.error.format(),
      },
      { status: 400 }
    );
  }

  const { acceptMessages } = validation.data;

  try {
    const updateUser = await UserModal.findByIdAndUpdate(
      userId,
      { isAcceptMessaging: acceptMessages },
      { new: true }
    );

    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update accept message status",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating accept message status:", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong while updating message status",
      },
      { status: 500 }
    );
  }
}



export async function GET(req:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!user || !session?.user) {
        return Response.json(
      {
        success: false,
        message: "User not authenticated plz login",
      },
      { status: 401 }
    );
    }


    const userId = user._id

    const getUserfromDb = await UserModal.findById(userId)

    if (!getUserfromDb) {
        return Response.json({
            success:false,
            message:"User not found plz login again"
        },{status:401})
    }

    return Response.json({
        success:true,
        message: "User message status sended succesfully",
        isAcceptingMessage: getUserfromDb.isAcceptMessaging
    },{status:200})



}
