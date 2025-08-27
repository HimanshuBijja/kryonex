import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { is } from "zod/locales";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<any> {
                //connect db
                await dbConnect();
                try {
                    //ccheck if user exists
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { username: credentials?.email },
                        ],
                    });
                    if (!user) {
                        throw new Error("No user found with this email");
                    }
                    //ccheck if user isverified

                    if (!user.isVerified) {
                        throw new Error("User is not verified");
                    }
                    //ccheck if password is correct
                    const verifyPassword = await bcrypt.compare(
                        credentials?.password || "",
                        user.password,
                    );
                    if (!verifyPassword) {
                        throw new Error("Invalid password");
                    } else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    //callbacks
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    //strategy
    session: {
        strategy: "jwt",
    },
    //secret NEXTAUTH_SECRET
    secret: process.env.NEXTAUTH_SECRET, //TODO add variable in .env
    //adapters if using prisma (not req as of now)
};
