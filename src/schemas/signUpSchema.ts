import z from 'zod';

export const usernameValidation = z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be at most 20 characters')
    .trim()
    .regex(
        /(?!.*[\.\_]{2,})^[a-zA-Z0-9\.\_]{2,20}$/,
        "Username may contain letters, numbers, underscores ( _ ) and periods ( . ) only.",
    );

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }),
});
