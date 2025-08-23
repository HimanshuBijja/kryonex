//get server session, auth options
//make post and get requests

import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    //get session
    const session = await getServerSession(authOptions);
    //get user
    const user: User = session?.user as User;
    //if no session or user
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
    //get user id
    const userId = user._id;
    //accept messages from frontend
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }, // returns the updated user
        );
        //Check if updated
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Failed to update user status to accepting messages",
                },
                {
                    status: 401,
                },
            );
        }
        return Response.json(
            {
                success: true,
                message: "updated user status to accepted messages",
                data: updatedUser,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.log("error accepting messages:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to accept messages",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            {
                status: 500,
            },
        );
    }
}

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

    const userId = user._id;
    //find user
    const foundUser = await UserModel.findById(userId);
    try {
        //Check if user is found  404
        if (!foundUser) {
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
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.log("error getting user acceptMessages status:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to retrieve use message status",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            {
                status: 500,
            },
        );
    }
}
