// import {
// 	createContext,
// 	type ReactNode,
// 	useCallback,
// 	useContext,
// 	useEffect,
// 	useState,
// } from "react";
// import {
// 	login as apiLogin,
// 	logout as apiLogout,
// 	signup as apiSignup,
// 	type LoginInBody,
// 	me,
// 	type SelfUser,
// 	type SignupInBody,
// } from "#/client";

// interface AuthContextType {
// 	user: SelfUser | null;
// 	isLoading: boolean;
// 	login: (credentials: LoginInBody) => Promise<SelfUser>;
// 	signup: (credentials: SignupInBody) => Promise<SelfUser>;
// 	logout: () => Promise<void>;
// 	refetchUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
// 	const [user, setUser] = useState<SelfUser | null>(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	const refetchUser = useCallback(async () => {
// 		try {
// 			const response = await me();
// 			if (response.data) {
// 				const { $schema, ...userData } = response.data;
// 				setUser(userData);
// 			} else {
// 				setUser(null);
// 			}
// 		} catch (e) {
// 			console.log(`refetchUser err: ${e}`);
// 			setUser(null);
// 		} finally {
// 			console.log(`refetchUser pass done user is ${user}`);
// 			setIsLoading(false);
// 		}
// 	}, [user]);

// 	useEffect(() => {
// 		refetchUser();
// 	}, [refetchUser]);

// 	const login = async (credentials: LoginInBody): Promise<SelfUser> => {
// 		const response = await apiLogin({ body: credentials });
// 		if (response.error || !response.data) {
// 			throw response.error ?? new Error("Login failed");
// 		}
// 		const { $schema, ...userData } = response.data;
// 		setUser(userData);
// 		return userData;
// 	};

// 	const signup = async (credentials: SignupInBody): Promise<SelfUser> => {
// 		const response = await apiSignup({ body: credentials });
// 		if (response.error || !response.data) {
// 			throw response.error ?? new Error("Signup failed");
// 		}
// 		const { $schema, ...userData } = response.data;
// 		setUser(userData);
// 		return userData;
// 	};

// 	const logout = async () => {
// 		try {
// 			await apiLogout();
// 		} finally {
// 			setUser(null);
// 		}
// 	};

// 	return (
// 		<AuthContext.Provider
// 			value={{
// 				user,
// 				isLoading,
// 				login,
// 				signup,
// 				logout,
// 				refetchUser,
// 			}}
// 		></AuthContext.Provider>
// 	);
// }

// export function useAuth() {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error("useAuth must be used within an AuthProvider");
// 	}
// 	return context;
// }
