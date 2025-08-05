export interface User {
    email: string;
    // Add other user properties if your /api/me endpoint returns them
    is_verified?: boolean;
    role?: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<TokenResponse>;
    loginGoogle: () => void;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
    storeAccessToken: (token: string) => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>; // For Google callback
}