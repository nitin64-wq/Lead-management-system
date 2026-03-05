import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './Leads.module.css';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadContext';
import LeadTable from '../../components/LeadTable/LeadTable';
import CallModal from '../../components/CallModal/CallModal';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { LEAD_STATUS, LEAD_SOURCES, COURSES } from '../../utils/constants';
import {
    FiPlus, FiX, FiCheckCircle, FiXCircle, FiPhone,
} from 'react-icons/fi';

const Leads = () => {
    const { user, isAdmin, isSales } = useAuth();
    const {
        leads, users, createLead, deleteLead, addRemark,
        assignLead, convertLead, closeLead,
    } = useLeads();
    const { searchQuery } = useOutletContext();

    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [callLead, setCallLead] = useState(null);
    const [viewLead, setViewLead] = useState(null);

    const [newLead, setNewLead] = useState({
        name: '', phone: '', email: '', course: '', source: '', assignedTo: '',
    });

    const salesUsers = users.filter((u) => u.role === 'sales');

    const filteredLeads = useMemo(() => {
        let filtered = isSales
            ? leads.filter((l) => l.assignedTo === user.id)
            : leads;

        if (statusFilter) filtered = filtered.filter((l) => l.status === statusFilter);
        if (sourceFilter) filtered = filtered.filter((l) => l.source === sourceFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
        }

        return filtered;
    }, [leads, isSales, user, statusFilter, sourceFilter, searchQuery]);

    const handleAddLead = (e) => {
        e.preventDefault();
        createLead(newLead);
        setNewLead({ name: '', phone: '', email: '', course: '', source: '', assignedTo: '' });
        setShowAddForm(false);
    };

    const handleCallSubmit = (remarkData) => {
        if (callLead) {
            addRemark(callLead.id, remarkData);
            setCallLead(null);
            // Refresh view lead if same
            if (viewLead?.id === callLead.id) {
                setViewLead(leads.find((l) => l.id === callLead.id) || null);
            }
        }
    };

    const handleAssign = (leadId, userId) => {
        assignLead(leadId, userId);
        if (viewLead?.id === leadId) {
            setViewLead(leads.find((l) => l.id === leadId) || null);
        }
    };

    const handleDelete = (lead) => {
        if (window.confirm(`Delete lead "${lead.name}"?`)) {
            deleteLead(lead.id);
            if (viewLead?.id === lead.id) setViewLead(null);
        }
    };

    // Refresh viewLead data
    const currentViewLead = viewLead ? leads.find((l) => l.id === viewLead.id) || viewLead : null;
    const viewUser = currentViewLead?.assignedTo
        ? users.find((u) => u.id === currentViewLead.assignedTo)
        : null;

    return (
        <div className={styles.leadsPage}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.filters}>
                    <select
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(LEAD_STATUS).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="">All Sources</option>
                        {LEAD_SOURCES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {isAdmin && (
                    <button className={styles.addBtn} onClick={() => setShowAddForm(true)} id="add-lead-btn">
                        <FiPlus /> Add Lead
                    </button>
                )}
            </div>

            {/* Lead Table */}
            <LeadTable
                leads={filteredLeads}
                title={`All Leads (${filteredLeads.length})`}
                onCallClick={setCallLead}
                onViewClick={setViewLead}
                onDeleteClick={isAdmin ? handleDelete : undefined}
            />

            {/* Add Lead Modal */}
            {showAddForm && (
                <div className={styles.formOverlay} onClick={() => setShowAddForm(false)}>
                    <div className={styles.formModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>Add New Lead</span>
                            <button className={styles.formCloseBtn} onClick={() => setShowAddForm(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleAddLead}>
                            <div className={styles.formBody}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name *</label>
                                        <input
                                            className={styles.formInput}
                                            value={newLead.name}
                                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Phone *</label>
                                        <input
                                            className={styles.formInput}
                                            value={newLead.phone}
                                            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Email</label>
                                    <input
                                        className={styles.formInput}
                                        type="email"
                                        value={newLead.email}
                                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Course *</label>
                                        <select
                                            className={styles.formInput}
                                            value={newLead.course}
                                            onChange={(e) => setNewLead({ ...newLead, course: e.target.value })}
                                            required
                                        >
                                            <option value="">Select course...</option>
                                            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Source *</label>
                                        <select
                                            className={styles.formInput}
                                            value={newLead.source}
                                            onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                                            required
                                        >
                                            <option value="">Select source...</option>
                                            {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Assign To</label>
                                    <select
                                        className={styles.formInput}
                                        value={newLead.assignedTo}
                                        onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                                    >
                                        <option value="">Unassigned</option>
                                        {salesUsers.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formFooter}>
                                <button type="button" className={styles.formCancelBtn} onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.formSubmitBtn}>Create Lead</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lead Detail Panel */}
            {currentViewLead && (
                <div className={styles.detailOverlay} onClick={() => setViewLead(null)}>
                    <div className={styles.detailPanel} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.detailHeader}>
                            <span className={styles.detailTitle}>Lead Details</span>
                            <button className={styles.formCloseBtn} onClick={() => setViewLead(null)}>
                                <FiX />
                            </button>
                        </div>
                        <div className={styles.detailBody}>
                            {/* Basic Info */}
                            <div className={styles.detailSection}>
                                <div className={styles.detailSectionTitle}>Contact Information</div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Name</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.name}</span>
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Phone</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.phone}</span>
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Email</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.email || '—'}</span>
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Course</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.course}</span>
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Source</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.source}</span>
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Status</span>
                                    <StatusBadge status={currentViewLead.status} />
                                </div>
                                <div className={styles.detailField}>
                                    <span className={styles.detailFieldLabel}>Created</span>
                                    <span className={styles.detailFieldValue}>{currentViewLead.createdAt}</span>
                                </div>
                                {currentViewLead.followUpDate && (
                                    <div className={styles.detailField}>
                                        <span className={styles.detailFieldLabel}>Next Follow-up</span>
                                        <span className={styles.detailFieldValue} style={{ color: '#d97706' }}>
                                            {currentViewLead.followUpDate}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Assignment */}
                            {isAdmin && (
                                <div className={styles.detailSection}>
                                    <div className={styles.detailSectionTitle}>Assignment</div>
                                    <select
                                        className={styles.assignSelect}
                                        value={currentViewLead.assignedTo || ''}
                                        onChange={(e) => handleAssign(currentViewLead.id, e.target.value || null)}
                                    >
                                        <option value="">Unassigned</option>
                                        {salesUsers.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Call History / Remarks */}
                            <div className={styles.detailSection}>
                                <div className={styles.detailSectionTitle}>Call History & Remarks</div>
                                {currentViewLead.remarks.length === 0 ? (
                                    <div className={styles.noRemarks}>No call history yet</div>
                                ) : (
                                    <div className={styles.remarkTimeline}>
                                        {[...currentViewLead.remarks].reverse().map((r, idx) => (
                                            <div className={styles.remarkItem} key={idx}>
                                                <div className={styles.remarkResponse}>{r.response}</div>
                                                <div className={styles.remarkText}>{r.remark}</div>
                                                <div className={styles.remarkDate}>{r.date}</div>
                                                {r.nextFollowUp && (
                                                    <div className={styles.remarkFollowUp}>
                                                        📅 Follow-up: {r.nextFollowUp}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className={styles.detailActions}>
                                <button
                                    className={styles.addBtn}
                                    style={{ fontSize: '0.82rem', padding: '10px 16px' }}
                                    onClick={() => { setCallLead(currentViewLead); }}
                                >
                                    <FiPhone /> Log Call
                                </button>
                                <button
                                    className={styles.convertBtn}
                                    onClick={() => { convertLead(currentViewLead.id); setViewLead(null); }}
                                >
                                    <FiCheckCircle /> Convert
                                </button>
                                <button
                                    className={styles.closeLeadBtn}
                                    onClick={() => { closeLead(currentViewLead.id); setViewLead(null); }}
                                >
                                    <FiXCircle /> Close Lead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

export default Leads;
