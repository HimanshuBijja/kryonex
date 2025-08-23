import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    const {content, username} = await request.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status: 404,
            });
        }
        const isUserAcceptingMessages = user.isAcceptingMessages;
        if(!isUserAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            },{
                status: 403,
            });
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message); //asserting
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully",
        },{
            status: 200,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({
            success: false,
            message: "Error sending message",
            error: error instanceof Error ? error.message : "Unknown error",
        },{
            status: 500,
        });
    }

}