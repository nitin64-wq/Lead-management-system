import { createContext, useContext, useState, useCallback } from 'react';
import { leadService } from '../services/leadService';

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
    const [leads, setLeads] = useState(() => leadService.getAllLeads());
    const [users, setUsers] = useState(() => leadService.getAllUsers());
    const [stats, setStats] = useState(() => leadService.getStats());

    const refreshLeads = useCallback(() => {
        setLeads(leadService.getAllLeads());
        setStats(leadService.getStats());
    }, []);

    const refreshUsers = useCallback(() => {
        setUsers(leadService.getAllUsers());
    }, []);

    const createLead = useCallback((data) => {
        const newLead = leadService.createLead(data);
        refreshLeads();
        return newLead;
    }, [refreshLeads]);

    const updateLead = useCallback((id, updates) => {
        const updated = leadService.updateLead(id, updates);
        refreshLeads();
        return updated;
    }, [refreshLeads]);

    const deleteLead = useCallback((id) => {
        leadService.deleteLead(id);
        refreshLeads();
    }, [refreshLeads]);

    const assignLead = useCallback((leadId, userId) => {
        const updated = leadService.assignLead(leadId, userId);
        refreshLeads();
        return updated;
    }, [refreshLeads]);

    const addRemark = useCallback((leadId, remarkData) => {
        const updated = leadService.addRemark(leadId, remarkData);
        refreshLeads();
        return updated;
    }, [refreshLeads]);

    const convertLead = useCallback((id) => {
        leadService.convertLead(id);
        refreshLeads();
    }, [refreshLeads]);

    const closeLead = useCallback((id) => {
        leadService.closeLead(id);
        refreshLeads();
    }, [refreshLeads]);

    const createUser = useCallback((data) => {
        const newUser = leadService.createUser(data);
        refreshUsers();
        return newUser;
    }, [refreshUsers]);

    const updateUser = useCallback((id, updates) => {
        const updated = leadService.updateUser(id, updates);
        refreshUsers();
        return updated;
    }, [refreshUsers]);

    const deleteUser = useCallback((id) => {
        leadService.deleteUser(id);
        refreshUsers();
    }, [refreshUsers]);

    const toggleUserStatus = useCallback((id) => {
        leadService.toggleUserStatus(id);
        refreshUsers();
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

    const getStats = useCallback((userId = null) => {
        return leadService.getStats(userId);
    }, [leads]);

    const value = {
        leads,
        users,
        stats,
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
