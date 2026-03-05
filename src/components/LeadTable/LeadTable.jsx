import { useState } from 'react';
import styles from './LeadTable.module.css';
import StatusBadge from '../StatusBadge/StatusBadge';
import { FiPhone, FiEye, FiTrash2, FiUsers } from 'react-icons/fi';
import { useLeads } from '../../context/LeadContext';

const ITEMS_PER_PAGE = 8;

const LeadTable = ({ leads, title, onCallClick, onViewClick, onDeleteClick, showActions = true }) => {
    const [page, setPage] = useState(1);
    const { getUserById } = useLeads();

    const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const displayLeads = leads.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const getInitials = (name) => {
        return name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    return (
        <div className={styles.tableContainer}>
            {title && (
                <div className={styles.tableHeader}>
                    <span className={styles.headerTitle}>{title}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {leads.length} lead{leads.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {displayLeads.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><FiUsers /></div>
                    <div className={styles.emptyTitle}>No leads found</div>
                    <div className={styles.emptyDesc}>Leads will appear here once created.</div>
                </div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Source</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    {showActions && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {displayLeads.map((lead) => {
                                    const assignedUser = lead.assignedTo
                                        ? getUserById(lead.assignedTo)
                                        : null;

                                    return (
                                        <tr key={lead.id}>
                                            <td>
                                                <div className={styles.leadName}>{lead.name}</div>
                                                <div className={styles.leadEmail}>{lead.email}</div>
                                            </td>
                                            <td>
                                                <span className={styles.phone}>{lead.phone}</span>
                                            </td>
                                            <td>
                                                <span className={styles.courseBadge}>{lead.course}</span>
                                            </td>
                                            <td>
                                                <span className={styles.sourceBadge}>{lead.source}</span>
                                            </td>
                                            <td>
                                                <StatusBadge status={lead.status} />
                                            </td>
                                            <td>
                                                {assignedUser ? (
                                                    <div className={styles.assignedUser}>
                                                        <div className={styles.assignedAvatar}>
                                                            {getInitials(assignedUser.name)}
                                                        </div>
                                                        <span>{assignedUser.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className={styles.unassigned}>Unassigned</span>
                                                )}
                                            </td>
                                            {showActions && (
                                                <td>
                                                    <div className={styles.actionBtns}>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.callBtn}`}
                                                            onClick={() => onCallClick?.(lead)}
                                                            title="Log call"
                                                        >
                                                            <FiPhone size={13} /> Call
                                                        </button>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.viewBtn}`}
                                                            onClick={() => onViewClick?.(lead)}
                                                            title="View details"
                                                        >
                                                            <FiEye size={13} />
                                                        </button>
                                                        {onDeleteClick && (
                                                            <button
                                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                                onClick={() => onDeleteClick?.(lead)}
                                                                title="Delete lead"
                                                            >
                                                                <FiTrash2 size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <span className={styles.pageInfo}>
                                Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, leads.length)} of {leads.length}
                            </span>
                            <div className={styles.pageButtons}>
                                <button
                                    className={styles.pageBtn}
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ''}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className={styles.pageBtn}
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LeadTable;
