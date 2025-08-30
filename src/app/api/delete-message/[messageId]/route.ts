import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";

export async function DELETE(
    request: Request,
    { params }: { params: { messageId: string } },
) {
    const { messageId } = params;
    await dbConnect();
    const session = await getServerSession();
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            },
            {
                status: 401,
            },
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            {
                _id: user._id,
            },
            {
                $pull: { message: { _id: messageId } },
            },
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found",
                },
                {
                    status: 404,
                },
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.log("🫦💔 delete message route :", error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete message",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error :" + error,
            },
            {
                status: 500,
            },
        );
    }
}
