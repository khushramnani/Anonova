import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";



export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated plz login",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModal.aggregate([
        {
            $match: {
                _id: userId
        }
    },
    {
        $unwind: '$messages'
    },
    {
        $sort:{
            'messages.createdAt':-1
        }
    },
    {
        $group:{
            _id: '$_id',
            messages:{$push: '$messages'}
        }
    }
    ]).exec()

    if (!user || user.length === 0) {
  return Response.json({
    success: true,
    messages: []
  }, { status: 200 });
}

    return Response.json({
        success:true,
        messages: user[0].messages
    },{status:200})


  } catch (error) {
    console.log(error)
     return Response.json({
        success:false,
        messages: "something went wrong on getting messages"
    },{status:500})
  }

}