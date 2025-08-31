import { generateMessagesSchema } from "@/schemas/generateMessagesSchema";
import { google } from "@ai-sdk/google";
import {

    APICallError,
    streamObject,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const context = await req.json();
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.  Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        // console.log("messages:", messages);
        

        const result = streamObject({
            model: google("gemini-2.5-flash"),
            schema: generateMessagesSchema,
            prompt: prompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof APICallError) {
            const { name, statusCode, responseHeaders, message } = error;
            console.error("API Call Error:", error.message);
            return Response.json(
                {
                    success: false,
                    message: "API Call Error",
                    error: {
                        name,
                        statusCode,
                        responseHeaders,
                        message,
                    },
                },
                {
                    status: statusCode,
                },
            );
        }
        console.error("Error:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
