//db usermodel zod

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success } from "zod";
import { fa } from "zod/locales";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        //find username frm db

        const user = await UserModel.findOne({
            username: decodedUsername,
        });
        //if else
        if(!user){
            return Response.json({
                success  : false,
                message: "User not found"
            },{
                status: 404
            })
        }

        const codeVerified = user.verifyCode === code;
        const isVerifyCodeNotExpiried = new Date(user.verifyCodeExpiry) > new Date();  

        if(codeVerified && isVerifyCodeNotExpiried){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            },{
                status: 200
            });
        }
        else if(codeVerified && !isVerifyCodeNotExpiried){
            return Response.json({
                success: false,
                message: "Verification code expired, Please signup again"
            },{
                status: 400
            });

        }
        return Response.json({
            success: false,
            message: "Incorrect verification code"
        },{
            status: 500
        });

        //Check code and expiry date
        //if code and time not expired save user

    } catch (error) {
        // console.log("error checking verification code:", error);
        return Response.json({
            success: false,
            message: "Verification code failed"
        },{
            status: 500
        })
    }

}