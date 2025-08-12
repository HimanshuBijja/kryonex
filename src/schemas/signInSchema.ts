import z from 'zod';

export const signInSchema = z.object({
    identifier: z
        .string(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' })
});
