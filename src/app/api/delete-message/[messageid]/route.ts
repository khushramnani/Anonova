import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";


type Params = {
  params: {
    messageid: string;
  };
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
): Promise<NextResponse<ApiResponse>> {

  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "User not authenticated, please login." },
      { status: 401 }
    );
  }

  try {
    const userId = session.user._id || session.user._id;
    const messageObjectId = new mongoose.Types.ObjectId(params.messageid);

    const result = await UserModal.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageObjectId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message Deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message." },
      { status: 500 }
    );
  }
}
