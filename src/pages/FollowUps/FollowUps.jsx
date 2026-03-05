import { useState, useMemo } from 'react';
import styles from './FollowUps.module.css';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadContext';
import LeadTable from '../../components/LeadTable/LeadTable';
import CallModal from '../../components/CallModal/CallModal';
import { FiCalendar, FiPhoneCall, FiClock } from 'react-icons/fi';

const FollowUps = () => {
    const { user, isSales } = useAuth();
    const { leads, addRemark } = useLeads();
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [callLead, setCallLead] = useState(null);

    const followUps = useMemo(() => {
        let filtered = isSales
            ? leads.filter((l) => l.assignedTo === user.id)
            : leads;
        return filtered.filter((l) => l.followUpDate === selectedDate);
    }, [leads, isSales, user, selectedDate]);

    const overdueFollowUps = useMemo(() => {
        let filtered = isSales
            ? leads.filter((l) => l.assignedTo === user.id)
            : leads;
        return filtered.filter((l) => l.followUpDate && l.followUpDate < today);
    }, [leads, isSales, user, today]);

    const upcomingFollowUps = useMemo(() => {
        let filtered = isSales
            ? leads.filter((l) => l.assignedTo === user.id)
            : leads;
        return filtered.filter((l) => l.followUpDate && l.followUpDate > today);
    }, [leads, isSales, user, today]);

    const handleCallSubmit = (remarkData) => {
        if (callLead) {
            addRemark(callLead.id, remarkData);
            setCallLead(null);
        }
    };

    return (
        <div className={styles.followUpsPage}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.dateFilter}>
                    <FiCalendar style={{ color: '#64748b' }} />
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button className={styles.todayBtn} onClick={() => setSelectedDate(today)}>
                        Today
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.miniStat}>
                    <div className={styles.miniStatIconBox} style={{ background: '#eef2ff', color: '#6366f1' }}>
                        <FiPhoneCall />
                    </div>
                    <div>
                        <div className={styles.miniStatValue}>{followUps.length}</div>
                        <div className={styles.miniStatLabel}>
                            {selectedDate === today ? "Today's Follow-ups" : `Follow-ups on ${selectedDate}`}
                        </div>
                    </div>
                </div>
                <div className={styles.miniStat}>
                    <div className={styles.miniStatIconBox} style={{ background: '#fef2f2', color: '#ef4444' }}>
                        <FiClock />
                    </div>
                    <div>
                        <div className={styles.miniStatValue}>{overdueFollowUps.length}</div>
                        <div className={styles.miniStatLabel}>Overdue</div>
                    </div>
                </div>
                <div className={styles.miniStat}>
                    <div className={styles.miniStatIconBox} style={{ background: '#ecfdf5', color: '#10b981' }}>
                        <FiCalendar />
                    </div>
                    <div>
                        <div className={styles.miniStatValue}>{upcomingFollowUps.length}</div>
                        <div className={styles.miniStatLabel}>Upcoming</div>
                    </div>
                </div>
            </div>

            {/* Follow-ups for selected date */}
            <LeadTable
                leads={followUps}
                title={selectedDate === today ? "📞 Today's Follow-ups" : `Follow-ups for ${selectedDate}`}
                onCallClick={setCallLead}
                onViewClick={() => { }}
            />

            {/* Overdue */}
            {overdueFollowUps.length > 0 && (
                <LeadTable
                    leads={overdueFollowUps}
                    title="⚠️ Overdue Follow-ups"
                    onCallClick={setCallLead}
                    onViewClick={() => { }}
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

export default FollowUps;
