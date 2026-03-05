import { useState } from 'react';
import styles from './CallModal.module.css';
import { CALL_RESPONSES } from '../../utils/constants';
import { FiPhone, FiX } from 'react-icons/fi';

const CallModal = ({ lead, onSubmit, onClose }) => {
    const [response, setResponse] = useState('');
    const [remark, setRemark] = useState('');
    const [nextFollowUp, setNextFollowUp] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!response || !remark) return;

        onSubmit({
            response,
            remark,
            nextFollowUp: nextFollowUp || null,
        });
    };

    const showFollowUp = ['Interested', 'Call Later', 'Number Busy', 'Not Reachable', 'Switched Off'].includes(response);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerIcon}>
                            <FiPhone />
                        </div>
                        <div>
                            <div className={styles.headerTitle}>Log Call Response</div>
                            <div className={styles.headerSub}>{lead?.name} — {lead?.phone}</div>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className={styles.body}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Call Response *</label>
                            <select
                                className={styles.select}
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                required
                                id="call-response-select"
                            >
                                <option value="">Select response...</option>
                                {CALL_RESPONSES.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Remarks *</label>
                            <textarea
                                className={styles.textarea}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Enter call remarks..."
                                required
                                id="call-remark-textarea"
                            />
                        </div>

                        {showFollowUp && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Next Follow-up Date</label>
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={nextFollowUp}
                                    onChange={(e) => setNextFollowUp(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    id="call-followup-date"
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!response || !remark}
                            id="call-submit-btn"
                        >
                            Save Response
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CallModal;
