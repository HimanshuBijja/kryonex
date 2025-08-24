import { google } from "@ai-sdk/google";
import {
    streamText,
    UIMessage,
    convertToModelMessages,
    APICallError,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        const { messages }: { messages: UIMessage[] } = await req.json();
        // console.log("messages:", messages);


        const result = streamText({
            model: google("gemini-2.5-flash"),
            maxOutputTokens: 200,
            // prompt: prompt,
            messages: convertToModelMessages(messages),//check later
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
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
