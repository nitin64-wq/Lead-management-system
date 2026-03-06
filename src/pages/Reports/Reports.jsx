import { useMemo } from 'react';
import styles from './Reports.module.css';
import { useLeads } from '../../context/LeadContext';
import { leadService } from '../../services/leadService';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#f97316', '#14b8a6', '#64748b'];

const Reports = () => {
    const { leads, users } = useLeads();

    const sourceData = useMemo(() => {
        const dist = {};
        leads.forEach((l) => {
            const source = l.source || 'Website';
            dist[source] = (dist[source] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [leads]);

    const courseData = useMemo(() => {
        const dist = {};
        leads.forEach((l) => {
            const course = l.course || 'Unknown';
            dist[course] = (dist[course] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [leads]);

    const statusData = useMemo(() => {
        const dist = {};
        leads.forEach((l) => { dist[l.status] = (dist[l.status] || 0) + 1; });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [leads]);

    const salesUsers = users.filter((u) => u.role === 'sales' || u.role === 'user');

    const userPerformance = useMemo(() => {
        return salesUsers.map((u) => {
            const userLeads = leads.filter(l => l.assignedTo === u.id);
            const stats = {
                total: userLeads.length,
                converted: userLeads.filter(l => l.status === 'Converted').length,
                interested: userLeads.filter(l => l.status === 'Interested').length,
                followUp: userLeads.filter(l => l.status === 'Follow Up').length,
            };
            return { ...u, stats };
        });
    }, [salesUsers, leads]);

    const getInitials = (name) =>
        name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <div className={styles.reportsPage}>
            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                {/* Source Distribution */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Leads by Source</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Leads by Status</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-20} textAnchor="end" height={60} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Course Distribution */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Leads by Course</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={courseData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={120} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                            <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Conversion Rate Summary */}
                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Conversion Funnel</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                                { stage: 'Total', value: leads.length },
                                { stage: 'Interested', value: leads.filter((l) => l.status === 'Interested').length },
                                { stage: 'Follow Up', value: leads.filter((l) => l.status === 'Follow Up').length },
                                { stage: 'Converted', value: leads.filter((l) => l.status === 'Converted').length },
                            ]}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Team Performance */}
            <div className={styles.sectionTitle}>Team Performance</div>
            <div className={styles.performanceGrid}>
                {userPerformance.map((u) => (
                    <div className={styles.perfCard} key={u.id}>
                        <div className={styles.perfUser}>
                            <div className={styles.perfAvatar}>{getInitials(u.name)}</div>
                            <div>
                                <div className={styles.perfName}>{u.name}</div>
                                <div className={styles.perfRole}>{u.role}</div>
                            </div>
                        </div>
                        <div className={styles.perfStats}>
                            <div className={styles.perfStat}>
                                <div className={styles.perfStatValue}>{u.stats.total}</div>
                                <div className={styles.perfStatLabel}>Total</div>
                            </div>
                            <div className={styles.perfStat}>
                                <div className={styles.perfStatValue}>{u.stats.converted}</div>
                                <div className={styles.perfStatLabel}>Converted</div>
                            </div>
                            <div className={styles.perfStat}>
                                <div className={styles.perfStatValue}>{u.stats.interested}</div>
                                <div className={styles.perfStatLabel}>Interested</div>
                            </div>
                            <div className={styles.perfStat}>
                                <div className={styles.perfStatValue}>{u.stats.followUp}</div>
                                <div className={styles.perfStatLabel}>Follow Up</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
