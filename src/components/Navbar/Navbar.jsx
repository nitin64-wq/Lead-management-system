import { useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/leads': 'Lead Management',
    '/follow-ups': 'Follow Ups',
    '/reports': 'Reports & Analytics',
    '/users': 'User Management',
};

const Navbar = ({ onMenuToggle, searchQuery, onSearchChange }) => {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Dashboard';

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <header className={styles.navbar}>
            <div className={styles.left}>
                <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
                    <FiMenu />
                </button>
                <h1 className={styles.pageTitle}>{title}</h1>
            </div>

            <div className={styles.right}>
                <div className={styles.searchBox}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search leads, users..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        id="global-search"
                    />
                </div>

                <span className={styles.dateDisplay}>{today}</span>

                <button className={styles.iconBtn} aria-label="Notifications" id="notif-btn">
                    <FiBell />
                    <span className={styles.notifDot} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
