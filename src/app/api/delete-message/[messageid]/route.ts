import UserModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, message: "User not authenticated, please login." },
      { status: 401 }
    );
  }

  try {
    const userId = session.user._id;  // Or session.user.id depending on what you store
    const messageObjectId = new mongoose.Types.ObjectId(params.messageid);

    const result = await UserModal.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageObjectId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted." },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message Deleted" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message." },
      { status: 500 }
    );
  }
}
