import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.layout}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={styles.mainArea}>
                <Navbar
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                <main className={styles.content}>
                    <Outlet context={{ searchQuery }} />
                </main>
            </div>
        </div>
    );
};

export default Layout;
