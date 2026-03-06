import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { leadService } from '../services/leadService';

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    const refreshLeads = useCallback(async () => {
        setLoading(true);
        const l = await leadService.getAllLeads();
        const s = await leadService.getStats();
        setLeads(l);
        setStats(s);
        setLoading(false);
    }, []);

    const refreshUsers = useCallback(async () => {
        const u = await leadService.getAllUsers();
        setUsers(u);
    }, []);

    useEffect(() => {
        refreshLeads();
        refreshUsers();
    }, [refreshLeads, refreshUsers]);

    const createLead = useCallback(async (data) => {
        const newLead = await leadService.createLead(data);
        await refreshLeads();
        return newLead;
    }, [refreshLeads]);

    const updateLead = useCallback(async (id, updates) => {
        const updated = await leadService.updateLead(id, updates);
        await refreshLeads();
        return updated;
    }, [refreshLeads]);

    const deleteLead = useCallback(async (id) => {
        await leadService.deleteLead(id);
        await refreshLeads();
    }, [refreshLeads]);

    const assignLead = useCallback(async (leadId, userId) => {
        const updated = await leadService.assignLead(leadId, userId);
        await refreshLeads();
        return updated;
    }, [refreshLeads]);

    const addRemark = useCallback(async (leadId, remarkData) => {
        const updated = await leadService.addRemark(leadId, remarkData);
        await refreshLeads();
        return updated;
    }, [refreshLeads]);

    const convertLead = useCallback(async (id) => {
        await leadService.convertLead(id);
        await refreshLeads();
    }, [refreshLeads]);

    const closeLead = useCallback(async (id) => {
        await leadService.closeLead(id);
        await refreshLeads();
    }, [refreshLeads]);

    const createUser = useCallback(async (data) => {
        const newUser = await leadService.createUser(data);
        await refreshUsers();
        return newUser;
    }, [refreshUsers]);

    const updateUser = useCallback(async (id, updates) => {
        const updated = await leadService.updateUser(id, updates);
        await refreshUsers();
        return updated;
    }, [refreshUsers]);

    const deleteUser = useCallback(async (id) => {
        await leadService.deleteUser(id);
        await refreshUsers();
    }, [refreshUsers]);

    const toggleUserStatus = useCallback(async (id) => {
        await leadService.toggleUserStatus(id);
        await refreshUsers();
    }, [refreshUsers]);

    const getUserById = useCallback((id) => {
        return users.find((u) => u.id === id) || null;
    }, [users]);

    const getLeadsByUser = useCallback((userId) => {
        return leads.filter((l) => l.assignedTo === userId);
    }, [leads]);

    const getTodayFollowUps = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        return leads.filter((l) => l.followUpDate === today);
    }, [leads]);

    // Added getStats returning real-time fetch to keep component compat
    const getStats = useCallback(async (userId = null) => {
        return await leadService.getStats(userId);
    }, []);

    const value = {
        leads,
        users,
        stats,
        loading,
        createLead,
        updateLead,
        deleteLead,
        assignLead,
        addRemark,
        convertLead,
        closeLead,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        getUserById,
        getLeadsByUser,
        getTodayFollowUps,
        getStats,
        refreshLeads,
        refreshUsers,
    };

    return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLeads() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error('useLeads must be used within a LeadProvider');
    }
    return context;
}

export default LeadContext;
