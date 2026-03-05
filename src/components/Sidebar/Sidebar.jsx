import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../../context/AuthContext';
import { SIDEBAR_MENU, ROLE_LABELS } from '../../utils/constants';
import {
    FiGrid, FiUsers, FiPhoneCall, FiBarChart2,
    FiUserPlus, FiLogOut, FiZap,
} from 'react-icons/fi';

const iconMap = {
    dashboard: FiGrid,
    leads: FiUsers,
    followups: FiPhoneCall,
    reports: FiBarChart2,
    users: FiUserPlus,
};

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const filteredMenu = SIDEBAR_MENU.filter(
        (item) => item.roles.includes(user?.role)
    );

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <FiZap />
                    </div>
                    <div>
                        <div className={styles.logoText}>LeadFlow</div>
                        <div className={styles.logoSub}>Management System</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <div className={styles.sectionLabel}>Main Menu</div>
                    {filteredMenu.map((item) => {
                        const Icon = iconMap[item.icon] || FiGrid;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                                }
                            >
                                <span className={styles.navIcon}>
                                    <Icon />
                                </span>
                                <span className={styles.navLabel}>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Card Footer */}
                <div className={styles.footer}>
                    <div className={styles.userCard}>
                        <div className={styles.userAvatar}>{getInitials(user?.name)}</div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user?.name}</div>
                            <div className={styles.userRole}>{ROLE_LABELS[user?.role] || user?.role}</div>
                        </div>
                        <button className={styles.logoutBtn} onClick={logout} title="Logout">
                            <FiLogOut />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
