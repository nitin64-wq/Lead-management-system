import { mockLeads, mockUsers } from '../utils/mockData';
import { LEAD_STATUS } from '../utils/constants';

const LEADS_KEY = 'lms_leads';
const USERS_KEY = 'lms_users';

function getStoredLeads() {
    const stored = localStorage.getItem(LEADS_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    localStorage.setItem(LEADS_KEY, JSON.stringify(mockLeads));
    return [...mockLeads];
}

function saveLeads(leads) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function getStoredUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return [...mockUsers];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const leadService = {
    // ===== Lead Operations =====
    getAllLeads() {
        return getStoredLeads();
    },

    getLeadsByUser(userId) {
        return getStoredLeads().filter((l) => l.assignedTo === userId);
    },

    getLeadById(leadId) {
        return getStoredLeads().find((l) => l.id === leadId) || null;
    },

    createLead(leadData) {
        const leads = getStoredLeads();
        const newLead = {
            id: `lead_${String(Date.now()).slice(-6)}`,
            ...leadData,
            status: LEAD_STATUS.NEW,
            assignedTo: leadData.assignedTo || null,
            remarks: [],
            followUpDate: null,
            createdAt: new Date().toISOString().split('T')[0],
        };
        if (newLead.assignedTo) {
            newLead.status = LEAD_STATUS.ASSIGNED;
        }
        leads.unshift(newLead);
        saveLeads(leads);
        return newLead;
    },

    updateLead(leadId, updates) {
        const leads = getStoredLeads();
        const idx = leads.findIndex((l) => l.id === leadId);
        if (idx === -1) return null;
        leads[idx] = { ...leads[idx], ...updates };
        saveLeads(leads);
        return leads[idx];
    },

    deleteLead(leadId) {
        let leads = getStoredLeads();
        leads = leads.filter((l) => l.id !== leadId);
        saveLeads(leads);
        return true;
    },

    assignLead(leadId, userId) {
        return this.updateLead(leadId, {
            assignedTo: userId,
            status: LEAD_STATUS.ASSIGNED,
        });
    },

    addRemark(leadId, remarkData) {
        const leads = getStoredLeads();
        const idx = leads.findIndex((l) => l.id === leadId);
        if (idx === -1) return null;

        const remark = {
            date: new Date().toISOString().split('T')[0],
            ...remarkData,
        };

        leads[idx].remarks.push(remark);

        // Update status based on response
        const responseStatusMap = {
            'Interested': LEAD_STATUS.INTERESTED,
            'Not Interested': LEAD_STATUS.NOT_INTERESTED,
            'Call Later': LEAD_STATUS.FOLLOW_UP,
            'Number Busy': LEAD_STATUS.CALL_NOT_PICKED,
            'Not Reachable': LEAD_STATUS.CALL_NOT_PICKED,
            'Wrong Number': LEAD_STATUS.CLOSED,
            'Switched Off': LEAD_STATUS.CALL_NOT_PICKED,
        };

        if (responseStatusMap[remarkData.response]) {
            leads[idx].status = responseStatusMap[remarkData.response];
        }

        if (remarkData.nextFollowUp) {
            leads[idx].followUpDate = remarkData.nextFollowUp;
            if (remarkData.response !== 'Not Interested') {
                leads[idx].status = LEAD_STATUS.FOLLOW_UP;
            }
        }

        saveLeads(leads);
        return leads[idx];
    },

    convertLead(leadId) {
        return this.updateLead(leadId, { status: LEAD_STATUS.CONVERTED });
    },

    closeLead(leadId) {
        return this.updateLead(leadId, { status: LEAD_STATUS.CLOSED });
    },

    getFollowUpsForDate(date) {
        return getStoredLeads().filter((l) => l.followUpDate === date);
    },

    getTodayFollowUps() {
        const today = new Date().toISOString().split('T')[0];
        return this.getFollowUpsForDate(today);
    },

    // ===== Statistics =====
    getStats(userId = null) {
        let leads = getStoredLeads();
        if (userId) {
            leads = leads.filter((l) => l.assignedTo === userId);
        }
        const today = new Date().toISOString().split('T')[0];
        return {
            total: leads.length,
            new: leads.filter((l) => l.status === LEAD_STATUS.NEW).length,
            assigned: leads.filter((l) => l.status === LEAD_STATUS.ASSIGNED).length,
            interested: leads.filter((l) => l.status === LEAD_STATUS.INTERESTED).length,
            notInterested: leads.filter((l) => l.status === LEAD_STATUS.NOT_INTERESTED).length,
            followUp: leads.filter((l) => l.status === LEAD_STATUS.FOLLOW_UP).length,
            converted: leads.filter((l) => l.status === LEAD_STATUS.CONVERTED).length,
            closed: leads.filter((l) => l.status === LEAD_STATUS.CLOSED).length,
            followUpsToday: leads.filter((l) => l.followUpDate === today).length,
            callNotPicked: leads.filter((l) => l.status === LEAD_STATUS.CALL_NOT_PICKED).length,
        };
    },

    getSourceDistribution(userId = null) {
        let leads = getStoredLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            dist[l.source] = (dist[l.source] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    getCourseDistribution(userId = null) {
        let leads = getStoredLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            dist[l.course] = (dist[l.course] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    getStatusDistribution(userId = null) {
        let leads = getStoredLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            dist[l.status] = (dist[l.status] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    // ===== User Operations =====
    getAllUsers() {
        return getStoredUsers().map(({ password, ...u }) => u);
    },

    getUserById(userId) {
        const user = getStoredUsers().find((u) => u.id === userId);
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    },

    createUser(userData) {
        const users = getStoredUsers();
        const newUser = {
            id: `usr_${String(Date.now()).slice(-6)}`,
            ...userData,
            password: userData.password || 'default123',
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
        };
        users.push(newUser);
        saveUsers(users);
        const { password, ...safeUser } = newUser;
        return safeUser;
    },

    updateUser(userId, updates) {
        const users = getStoredUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
        const { password, ...safeUser } = users[idx];
        return safeUser;
    },

    deleteUser(userId) {
        let users = getStoredUsers();
        users = users.filter((u) => u.id !== userId);
        saveUsers(users);
        return true;
    },

    toggleUserStatus(userId) {
        const users = getStoredUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx === -1) return null;
        users[idx].isActive = !users[idx].isActive;
        saveUsers(users);
        return users[idx];
    },
};
