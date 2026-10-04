import { z } from "zod";

export const signupSchema = z.object({
	handle: z
		.string()
		.trim()
		.min(3, "At least 3 characters")
		.max(20, "At most 20 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
	email: z.email("Enter a valid email"),
	password: z.string().min(8, "At least 8 characters").max(128, "Too long"),
});

export const loginSchema = z.object({
	handleOrEmail: z.string().min(1, "Required"),
	password: z.string().min(8, "At least 8 characters").max(128, "Too long"),
});
