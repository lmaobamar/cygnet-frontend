import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { LoginInBody, SelfUser, SignupInBody } from "#/client";
import {
	AuthError,
	login as apiLogin,
	logout as apiLogout,
	signup as apiSignup,
	me,
} from "#/lib/api";

interface AuthContextType {
	user: SelfUser | null;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginInBody) => Promise<SelfUser>;
	signup: (credentials: SignupInBody) => Promise<SelfUser>;
	logout: () => Promise<void>;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<SelfUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const requestVersion = useRef(0);

	const refetchUser = useCallback(async () => {
		const version = ++requestVersion.current;
		setIsLoading(true);
		setError(null);
		try {
			const response = await me();
			if (version !== requestVersion.current) return;
			if (response.response?.status === 401) {
				setUser(null);
			} else if (response.error || !response.data) {
				throw new AuthError(
					response.error,
					"Unable to check your session. Please try again.",
				);
			} else {
				setUser(response.data);
			}
		} catch (cause) {
			if (version === requestVersion.current) {
				setError(
					cause instanceof Error
						? cause.message
						: "Unable to check your session.",
				);
			}
		} finally {
			if (version === requestVersion.current) setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refetchUser();
		return () => {
			requestVersion.current++;
		};
	}, [refetchUser]);

	const authenticate = useCallback(
		async (credentials: LoginInBody | SignupInBody, isSignup: boolean) => {
			const version = ++requestVersion.current;
			setIsLoading(true);
			setError(null);
			try {
				const response = isSignup
					? await apiSignup({ body: credentials as SignupInBody })
					: await apiLogin({ body: credentials as LoginInBody });
				if (response.error || !response.data) {
					throw new AuthError(
						response.error,
						isSignup ? "Unable to create your account." : "Unable to log in.",
					);
				}
				if (version === requestVersion.current) setUser(response.data);
				return response.data;
			} finally {
				if (version === requestVersion.current) setIsLoading(false);
			}
		},
		[],
	);

	const login = useCallback(
		(credentials: LoginInBody) => authenticate(credentials, false),
		[authenticate],
	);
	const signup = useCallback(
		(credentials: SignupInBody) => authenticate(credentials, true),
		[authenticate],
	);
	const logout = useCallback(async () => {
		const version = ++requestVersion.current;
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiLogout();
			if (response.error || !response.response?.ok) {
				throw new AuthError(
					response.error,
					"Unable to log out. Please try again.",
				);
			}
			if (version === requestVersion.current) setUser(null);
		} finally {
			if (version === requestVersion.current) setIsLoading(false);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, isLoading, error, login, signup, logout, refetchUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
