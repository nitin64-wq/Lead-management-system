const API_URL = 'http://localhost:5000/api/auth';
const STORAGE_KEY = 'lms_auth';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!data.success) {
                return { success: false, error: data.message || 'Invalid credentials' };
            }

            const safeUser = { ...data.data, id: data.data._id };
            delete safeUser.password;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
            return { success: true, user: safeUser };
        } catch (error) {
            return { success: false, error: 'Network error or server down' };
        }
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
