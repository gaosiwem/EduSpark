'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { User, TokenResponse, AuthContextType } from '../types'; // Import types

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = 'http://localhost:8004';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const storeAccessToken = (token: string): void => {
        if (accessToken !== token) {
            localStorage.setItem('access_token', token);
            setAccessToken(token);
        }
    };

    const removeAccessToken = (): void => {
        localStorage.removeItem('access_token');
        setAccessToken(null);
    };

    const checkSession = React.useCallback(async (): Promise<boolean> => {
        try {
            const storedToken = localStorage.getItem('access_token');
            if (storedToken) {
                try {
                    const response = await axios.get<User>(`${API_BASE_URL}/api/me`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                        withCredentials: true
                    });
                    const { email: userEmail, is_verified, role } = response.data;
                    setUser({ email: userEmail, is_verified, role });
                    setAccessToken(storedToken);
                    setLoading(false);
                    return true;
                } catch (error) {
                    console.warn('Access token invalid/expired, checking remember me cookie...');
                }
            }

            const checkSessionResponse = await axios.get<TokenResponse>(`${API_BASE_URL}/api/check-session`, {withCredentials: true});  
            const { access_token, email: userEmail } = checkSessionResponse.data;
            storeAccessToken(access_token);
            setUser({ email: userEmail });
            setLoading(false);
            return true;
        } catch (error: any) {
            console.error('Check session error:', error.response?.data || error.message);
            removeAccessToken();
            setUser(null);
            setLoading(false);
            return false;
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const authService = {
        login: async (email: string, password: string): Promise<TokenResponse> => {
            try {
                const response = await axios.post<TokenResponse>(`${API_BASE_URL}/api/login`, { email, password });
                const { access_token, email: userEmail } = response.data;
                storeAccessToken(access_token);
                setUser({ email: userEmail });
                return response.data;
            } catch (error: any) {
                console.error('Login error:', error.response?.data || error.message);
                throw error;
            }
        },
        loginGoogle: (): void => {
            try {
                window.location.href = `${API_BASE_URL}/api/login/google`;
            } catch (error: any) {
                console.error('Google login initiation error:', error.response?.data || error.message);
                throw error;
            }
        },
        logout: async (): Promise<void> => {
            try {
                const currentToken = localStorage.getItem('access_token');
                if (currentToken) {
                    await axios.post(`${API_BASE_URL}/api/logout`, {}, {
                        headers: { Authorization: `Bearer ${currentToken}` },
                        withCredentials: true
                    });
                }
                removeAccessToken();
                setUser(null);
            } catch (error: any) {
                console.error('Logout error:', error.response?.data || error.message);
                removeAccessToken();
                setUser(null);
            }
        }
    };

    const value: AuthContextType = {
        user,
        accessToken,
        loading,
        login: authService.login,
        loginGoogle: authService.loginGoogle,
        logout: authService.logout,
        checkSession,
        storeAccessToken,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};