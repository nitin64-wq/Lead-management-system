import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [error, setError] = useState(null);

    const login = useCallback((email, password) => {
        setError(null);
        const result = authService.login(email, password);
        if (result.success) {
            setUser(result.user);
            return true;
        }
        setError(result.error);
        return false;
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setError(null);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const value = {
        user,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isSales: user?.role === 'sales',
        login,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
