import styles from './StatusBadge.module.css';
import { LEAD_STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
    const colors = LEAD_STATUS_COLORS[status] || { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };

    return (
        <span
            className={styles.badge}
            style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
            }}
        >
            <span className={styles.dot} style={{ backgroundColor: colors.text }} />
            {status}
        </span>
    );
};

export default StatusBadge;
