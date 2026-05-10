'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext(null);

const API_URL =
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

/**
 * AuthProvider - Manages authentication state
 * - Loads user from localStorage
 * - Handles login/logout
 * - Provides token to other providers
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hydrated, setHydrated] = useState(false);

    const buildCookie = (tokenValue = '', maxAge = 0) => {
        const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const secureSegment = isSecure ? '; Secure' : '';
        return `token=${tokenValue}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secureSegment}`;
    };

    const setAuthCookie = (tokenValue) => {
        document.cookie = buildCookie(tokenValue, 60 * 60 * 24 * 7);
    };

    const clearAuthCookie = () => {
        document.cookie = buildCookie('', 0);
    };

    // Initialize auth from localStorage (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') {
            setHydrated(true);
            return;
        }

        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                setHydrated(true);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.success && data.data?.role === 'admin') {
                    setUser(data.data);
                    setAuthCookie(token);
                } else {
                    // Clear invalid auth
                    localStorage.removeItem('token');
                    clearAuthCookie();
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                localStorage.removeItem('token');
                clearAuthCookie();
                setUser(null);
            } finally {
                setLoading(false);
                setHydrated(true);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!data.success) {
                return {
                    success: false,
                    message: data.message || 'Login failed',
                };
            }

            // Check if user is admin
            if (data.user?.role !== 'admin') {
                return {
                    success: false,
                    message: 'Access denied. Only admins can enter here.',
                };
            }

            // Store token in both localStorage and cookie
            const token = data.token;
            localStorage.setItem('token', token);
            setAuthCookie(token);

            setUser(data.user);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Server connection error',
            };
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        clearAuthCookie();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        hydrated: true,
    }), [user, loading, login, logout]);

    // Don't render anything until hydration is complete
    if (!hydrated) {
        return (
            <AuthContext.Provider
                value={{
                    user: null,
                    loading: true,
                    login,
                    logout,
                    hydrated: false,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth - Hook to access auth context
 * Returns safe defaults if context is not available
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        return {
            user: null,
            loading: true,
            login: async () => ({ success: false, message: 'Auth not initialized' }),
            logout: () => { },
            hydrated: false,
        };
    }

    return context;
};

/**
 * ProtectedRoute - Wrapper for pages that need authentication
 * - Shows loader while checking auth
 * - Redirects to login if not authenticated
 * - Only runs on client-side after hydration
 */
export const ProtectedRoute = ({ children, isLoginPage = false }) => {
    const { user, loading, hydrated } = useAuth();
    const pathname = usePathname();
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        if (!hydrated) return;

        // If we're on login page and user is logged in, redirect to dashboard
        if (isLoginPage && user) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                window.location.replace('/');
            }
            return;
        }

        // If we're on protected page and user is not logged in, redirect to login
        if (!isLoginPage && !loading && !user) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
            return;
        }

        setCanRender(true);
    }, [user, loading, hydrated, isLoginPage, pathname]);

    // Show loader while auth is loading or not hydrated
    if (!hydrated || (loading && !isLoginPage)) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#FDFCFB] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Show login page loader if on login page and loading
    if (isLoginPage && loading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#FDFCFB] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render children until auth check is done
    if (!canRender) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#FDFCFB] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0a4019] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};