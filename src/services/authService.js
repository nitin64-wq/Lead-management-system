import { mockUsers } from '../utils/mockData';

const STORAGE_KEY = 'lms_auth';

export const authService = {
    login(email, password) {
        const user = mockUsers.find(
            (u) => u.email === email && u.password === password && u.isActive
        );
        if (!user) {
            return { success: false, error: 'Invalid credentials or account disabled' };
        }
        const { password: _, ...safeUser } = user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
        return { success: true, user: safeUser };
    },

    logout() {
        localStorage.removeItem(STORAGE_KEY);
    },

    getCurrentUser() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    },
};
