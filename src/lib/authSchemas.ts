import { z } from "zod";

const password = z
	.string()
	.max(72, "At most 72 characters")
	.refine(
		(value) => new TextEncoder().encode(value).length <= 72,
		"Password must be at most 72 bytes",
	);

export const signupSchema = z.object({
	handle: z
		.string()
		.trim()
		.toLowerCase()
		.min(3, "At least 3 characters")
		.max(32, "At most 32 characters")
		.regex(/^[a-z0-9_]+$/, "Letters, numbers and underscores only"),
	email: z
		.email("Enter a valid email")
		.trim()
		.toLowerCase()
		.max(255, "Too long"),
	password: password.refine(
		(value) => value.length >= 8,
		"At least 8 characters",
	),
	displayName: z.string().trim().max(50, "At most 50 characters").optional(),
});

export const loginSchema = z.object({
	handleOrEmail: z.string().trim().toLowerCase().min(1, "Required"),
	password: password.refine((value) => value.length >= 1, "Required"),
});
