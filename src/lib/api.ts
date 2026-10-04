import { client } from "#/client/client.gen";

// Use the frontend's /api proxy by default so session cookies stay same-origin.
// Keep runtime configuration outside generated files so api:sync cannot erase it.
client.setConfig({
	baseUrl:
		import.meta.env.VITE_API_BASE_URL ||
		(typeof window !== "undefined"
			? window.location.origin
			: "http://localhost:3000"),
	credentials: "include",
});

export { login, logout, me, signup } from "#/client";

export class AuthError extends Error {
	fields: Record<string, string>;

	constructor(error: unknown, fallback: string) {
		const problem =
			error && typeof error === "object"
				? (error as Record<string, unknown>)
				: {};
		const message = problem.message ?? problem.detail ?? problem.title;
		super(typeof message === "string" ? message : fallback);
		this.name = "AuthError";
		this.fields = {};
		const details = problem.fields ?? problem.errors;
		if (Array.isArray(details)) {
			for (const detail of details) {
				if (!detail || typeof detail !== "object") continue;
				const field = detail.field ?? detail.location;
				if (typeof field === "string" && typeof detail.message === "string") {
					this.fields[field.replace(/^body\./, "")] = detail.message;
				}
			}
		}
	}
}
