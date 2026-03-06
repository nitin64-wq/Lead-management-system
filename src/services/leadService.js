import { LEAD_STATUS } from '../utils/constants';

const API_LEADS_URL = 'http://localhost:5000/api/leads';
const API_USERS_URL = 'http://localhost:5000/api/users';

const mapId = (obj) => ({ ...obj, id: obj._id });

export const leadService = {
    // ===== Lead Operations =====
    async getAllLeads() {
        const res = await fetch(API_LEADS_URL);
        const data = await res.json();
        return data.data ? data.data.map(mapId) : [];
    },

    async getLeadsByUser(userId) {
        const leads = await this.getAllLeads();
        return leads.filter((l) => l.assignedTo === userId);
    },

    async getLeadById(leadId) {
        const res = await fetch(`${API_LEADS_URL}/${leadId}`);
        const data = await res.json();
        return data.data ? mapId(data.data) : null;
    },

    async createLead(leadData) {
        const payload = {
            ...leadData,
            status: leadData.assignedTo ? LEAD_STATUS.ASSIGNED : LEAD_STATUS.NEW,
            remarks: [],
            followUpDate: null,
        };
        const res = await fetch(API_LEADS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return data.data ? mapId(data.data) : null;
    },

    async updateLead(leadId, updates) {
        const res = await fetch(`${API_LEADS_URL}/${leadId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        return data.data ? mapId(data.data) : null;
    },

    async deleteLead(leadId) {
        await fetch(`${API_LEADS_URL}/${leadId}`, { method: 'DELETE' });
        return true;
    },

    async assignLead(leadId, userId) {
        return this.updateLead(leadId, {
            assignedTo: userId,
            status: LEAD_STATUS.ASSIGNED,
        });
    },

    async addRemark(leadId, remarkData) {
        const lead = await this.getLeadById(leadId);
        if (!lead) return null;

        const remark = {
            date: new Date().toISOString().split('T')[0],
            ...remarkData,
        };

        const updates = { remarks: [...(lead.remarks || []), remark] };

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
            updates.status = responseStatusMap[remarkData.response];
        }

        if (remarkData.nextFollowUp) {
            updates.followUpDate = remarkData.nextFollowUp;
            if (remarkData.response !== 'Not Interested') {
                updates.status = LEAD_STATUS.FOLLOW_UP;
            }
        }

        return this.updateLead(leadId, updates);
    },

    async convertLead(leadId) {
        return this.updateLead(leadId, { status: LEAD_STATUS.CONVERTED });
    },

    async closeLead(leadId) {
        return this.updateLead(leadId, { status: LEAD_STATUS.CLOSED });
    },

    async getTodayFollowUps() {
        const today = new Date().toISOString().split('T')[0];
        const leads = await this.getAllLeads();
        return leads.filter((l) => l.followUpDate === today);
    },

    // ===== Statistics =====
    async getStats(userId = null) {
        let leads = await this.getAllLeads();
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

    async getSourceDistribution(userId = null) {
        let leads = await this.getAllLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            dist[l.source || 'Website'] = (dist[l.source || 'Website'] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    async getCourseDistribution(userId = null) {
        let leads = await this.getAllLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            const course = l.course || 'Unknown';
            dist[course] = (dist[course] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    async getStatusDistribution(userId = null) {
        let leads = await this.getAllLeads();
        if (userId) leads = leads.filter((l) => l.assignedTo === userId);
        const dist = {};
        leads.forEach((l) => {
            dist[l.status] = (dist[l.status] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    },

    // ===== User Operations =====
    async getAllUsers() {
        const res = await fetch(API_USERS_URL);
        const data = await res.json();
        return data.data ? data.data.map(mapId).map(({ password, ...u }) => u) : [];
    },

    async getUserById(userId) {
        const res = await fetch(`${API_USERS_URL}/${userId}`);
        const data = await res.json();
        if (!data.data) return null;
        const u = mapId(data.data);
        delete u.password;
        return u;
    },

    async createUser(userData) {
        const res = await fetch(API_USERS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        const u = data.data ? mapId(data.data) : null;
        if (u) delete u.password;
        return u;
    },

    async updateUser(userId, updates) {
        const res = await fetch(`${API_USERS_URL}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        const u = data.data ? mapId(data.data) : null;
        if (u) delete u.password;
        return u;
    },

    async deleteUser(userId) {
        await fetch(`${API_USERS_URL}/${userId}`, { method: 'DELETE' });
        return true;
    },

    async toggleUserStatus(userId) {
        const user = await this.getUserById(userId);
        if (!user) return null;
        return this.updateUser(userId, { isActive: !user.isActive });
    },
};
