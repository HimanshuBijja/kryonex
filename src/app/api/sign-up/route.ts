import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';
import  bcrypt from 'bcryptjs';
import VerificationEmail from '../../../../emails/verificationEmail';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { success } from 'zod';
 'bcryptjs';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, username, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username already taken',
                },
                {
                    status: 400,
                },
            );
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        //genereate verifycode
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail){
            
            //if verified return
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: 'Email already verified'
                },{
                    status: 400
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword; 
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
            //else send verification code in db
        }else{
            //encrypt pass  by 10 rounds
            const hashedPassword = await bcrypt.hash(password, 10)
            //expiry date
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            //store user in db
            
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            
            await newUser.save();
        }
        
        //send verification code 
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            },{
                status: 500
            })
         }

         return NextResponse.json({
            success: true,
            message: 'User Registered Successfully, Please Verify Your Email'
         } ,{
            status: 201
         })


    } catch (error) {
        // console.error('Error Registering user', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error Registering user',
            },
            {
                status: 500,
            },
        );
    }
}
