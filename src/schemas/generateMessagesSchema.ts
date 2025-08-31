import { z } from "zod";

// define a schema for the messages
export const generateMessagesSchema = z.object({
    messages: z.array(
        z.object({
            context: z
                .string()
                .describe("context. Do not use emojis or links.")
                .min(10, {
                    message: "Message must be at least 10 characters long",
                })
                .max(100, {
                    message: "Message must be no more than 100 characters long",
                }),
        }),
    ),
});
