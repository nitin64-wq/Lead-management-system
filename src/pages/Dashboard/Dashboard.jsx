import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadContext';
import LeadTable from '../../components/LeadTable/LeadTable';
import CallModal from '../../components/CallModal/CallModal';
import { LEAD_STATUS_COLORS } from '../../utils/constants';
import {
    FiUsers, FiUserPlus, FiPhoneCall, FiCheckCircle,
    FiXCircle, FiTrendingUp, FiPlus, FiCalendar,
} from 'react-icons/fi';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];

const Dashboard = () => {
    const { user, isAdmin, isSales } = useAuth();
    const { leads, stats, addRemark, getTodayFollowUps, getStats } = useLeads();
    const navigate = useNavigate();
    const [callLead, setCallLead] = useState(null);

    const currentStats = useMemo(() => {
        return isSales ? getStats(user.id) : getStats();
    }, [isSales, user, getStats, leads]);

    const recentLeads = useMemo(() => {
        let filtered = isSales ? leads.filter((l) => l.assignedTo === user.id) : leads;
        return filtered.slice(0, 5);
    }, [leads, isSales, user]);

    const followUpsToday = useMemo(() => getTodayFollowUps(), [leads, getTodayFollowUps]);

    const sourceData = useMemo(() => {
        let filtered = isSales ? leads.filter((l) => l.assignedTo === user.id) : leads;
        const dist = {};
        filtered.forEach((l) => { dist[l.source] = (dist[l.source] || 0) + 1; });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [leads, isSales, user]);

    const statusData = useMemo(() => {
        let filtered = isSales ? leads.filter((l) => l.assignedTo === user.id) : leads;
        const dist = {};
        filtered.forEach((l) => { dist[l.status] = (dist[l.status] || 0) + 1; });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [leads, isSales, user]);

    const recentActivity = useMemo(() => {
        let filtered = isSales ? leads.filter((l) => l.assignedTo === user.id) : leads;
        const activities = [];
        filtered.forEach((lead) => {
            activities.push({
                id: `${lead.id}-created`,
                text: `${lead.name} — Lead Created`,
                date: lead.createdAt,
                type: 'created',
                color: '#6366f1',
            });
            lead.remarks.forEach((r, idx) => {
                activities.push({
                    id: `${lead.id}-remark-${idx}`,
                    text: `${lead.name} — ${r.response}`,
                    date: r.date,
                    type: r.response.toLowerCase().replace(/\s+/g, '-'),
                    color: LEAD_STATUS_COLORS[lead.status]?.text || '#64748b',
                    detail: r.remark,
                });
            });
        });
        return activities.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    }, [leads, isSales, user]);

    const handleCallSubmit = (remarkData) => {
        if (callLead) {
            addRemark(callLead.id, remarkData);
            setCallLead(null);
        }
    };

    const statCards = [
        { label: 'Total Leads', value: currentStats.total, icon: <FiUsers />, color: '#6366f1', bg: '#eef2ff' },
        { label: 'New Leads', value: currentStats.new, icon: <FiUserPlus />, color: '#2563eb', bg: '#eff6ff' },
        { label: 'Follow Ups Today', value: currentStats.followUpsToday, icon: <FiCalendar />, color: '#d97706', bg: '#fffbeb' },
        { label: 'Converted', value: currentStats.converted, icon: <FiCheckCircle />, color: '#16a34a', bg: '#f0fdf4' },
        { label: 'Not Interested', value: currentStats.notInterested, icon: <FiXCircle />, color: '#dc2626', bg: '#fef2f2' },
    ];

    return (
        <div className={styles.dashboard}>
            {/* Quick Actions */}
            <div className={styles.quickActions}>
                {isAdmin && (
                    <button className={`${styles.quickBtn} ${styles.quickBtnPrimary}`} onClick={() => navigate('/leads')}>
                        <FiPlus /> Add New Lead
                    </button>
                )}
                <button className={styles.quickBtn} onClick={() => navigate('/follow-ups')}>
                    <FiPhoneCall /> Follow Ups ({currentStats.followUpsToday})
                </button>
                <button className={styles.quickBtn} onClick={() => navigate('/leads')}>
                    <FiTrendingUp /> View All Leads
                </button>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {statCards.map((card) => (
                    <div className={styles.statCard} key={card.label}>
                        <div className={styles.statIcon} style={{ background: card.bg, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{card.value}</div>
                            <div className={styles.statLabel}>{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts + Timeline */}
            <div className={styles.contentGrid}>
                <div>
                    {/* Source Distribution Chart */}
                    <div className={styles.chartCard} style={{ marginBottom: 20 }}>
                        <div className={styles.chartTitle}>Lead Source Distribution</div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={sourceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status Distribution Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartTitle}>Status Overview</div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    {/* Activity Timeline */}
                    <div className={styles.timelineCard}>
                        <div className={styles.timelineTitle}>Recent Activity</div>
                        <div className={styles.timeline}>
                            {recentActivity.map((act) => (
                                <div className={styles.timelineItem} key={act.id}>
                                    <div
                                        className={styles.timelineDot}
                                        style={{ background: act.color + '20', color: act.color }}
                                    >
                                        ●
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineText}>{act.text}</div>
                                        {act.detail && (
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                                                {act.detail}
                                            </div>
                                        )}
                                        <div className={styles.timelineDate}>{act.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leads Table */}
            <LeadTable
                leads={recentLeads}
                title="Recent Leads"
                onCallClick={setCallLead}
                onViewClick={(lead) => navigate('/leads')}
            />

            {/* Follow-Ups Today Table */}
            {followUpsToday.length > 0 && (
                <LeadTable
                    leads={followUpsToday}
                    title="📞 Follow Ups for Today"
                    onCallClick={setCallLead}
                    onViewClick={(lead) => navigate('/leads')}
                />
            )}

            {/* Call Modal */}
            {callLead && (
                <CallModal
                    lead={callLead}
                    onSubmit={handleCallSubmit}
                    onClose={() => setCallLead(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
