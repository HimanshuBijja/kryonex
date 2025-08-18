//db model zod schema usernamevalidation

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import z, { success } from "zod";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})


export async function GET(request: NextRequest) {

    // if(request.method !== "GET"){

    //     return NextResponse.json({
    //         success: false,
    //         message: "Only GET method is allowed"
    //     }, {
    //         status: 405
    //     })
    // } // use if using express, Next handles it automatically

    await dbConnect();
    try {
        const searchParams = request.nextUrl.searchParams //check did differently 
        const username = searchParams.get("username")

        const result = UsernameQuerySchema.safeParse({ username });
        console.log(result); // Log
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return NextResponse.json({
                success : false,
                message : usernameError.length > 0 ? usernameError.join(", ") : "Invalid username/ query parameters"
            },{
                status: 400
            })
        }

        // const {username} = result.data; // used if  done by another method
        //Check if username exists in the database

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingVerifiedUser){
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }

        return NextResponse.json({
            success: true,
            message: "Username is available"
        }, {
            status: 200
        })


    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        },{
            status: 500
        })
    }
}