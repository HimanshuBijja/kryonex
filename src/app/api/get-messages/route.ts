import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            {
                status: 401,
            },
        );
    }
    const userId = new mongoose.Types.ObjectId(user._id as string); //4:11

    try {
        // aggregation pipeline
        const foundUser = await UserModel.aggregate([
            {$match : {_id: userId}},
            { $unwind : "$messages" },
            {$sort: {"messages.createdAt": -1}},
            {$group : {_id : "$_id", messages: {$push: "$messages"}}}
        ]);
        if (!foundUser || foundUser.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                },
            );
        }
        return Response.json(
            {
                success: true,
                message: "Messages retrieved successfully",
                messages: foundUser[0].messages,
                fullReturn : foundUser //TODO remove later
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.log("error getting messages:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to retrieve messages",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            {
                status: 500,
            },
        );
    }
}
