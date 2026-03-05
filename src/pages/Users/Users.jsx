import { useState } from 'react';
import styles from './Users.module.css';
import { useLeads } from '../../context/LeadContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';
import {
    FiPlus, FiX, FiMail, FiPhone, FiCalendar, FiTrash2,
} from 'react-icons/fi';

const Users = () => {
    const { users, createUser, deleteUser, toggleUserStatus } = useLeads();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '', email: '', phone: '', role: ROLES.SALES, password: '',
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        createUser(newUser);
        setNewUser({ name: '', email: '', phone: '', role: ROLES.SALES, password: '' });
        setShowAddForm(false);
    };

    const handleDelete = (user) => {
        if (window.confirm(`Delete user "${user.name}"?`)) {
            deleteUser(user.id);
        }
    };

    const getInitials = (name) =>
        name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <div className={styles.usersPage}>
            <div className={styles.topBar}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {users.length} users total
                </span>
                <button className={styles.addBtn} onClick={() => setShowAddForm(true)} id="add-user-btn">
                    <FiPlus /> Add User
                </button>
            </div>

            {/* Users Grid */}
            <div className={styles.usersGrid}>
                {users.map((u) => (
                    <div className={styles.userCard} key={u.id}>
                        <div className={styles.userHeader}>
                            <div className={styles.userAvatar}>{getInitials(u.name)}</div>
                            <div style={{ flex: 1 }}>
                                <div className={styles.userName}>{u.name}</div>
                                <div className={styles.userRole}>{ROLE_LABELS[u.role] || u.role}</div>
                            </div>
                            <span className={u.isActive ? styles.statusBadgeActive : styles.statusBadgeInactive}>
                                {u.isActive ? '● Active' : '● Inactive'}
                            </span>
                        </div>

                        <div className={styles.userDetails}>
                            <div className={styles.userDetail}>
                                <FiMail className={styles.userDetailIcon} />{u.email}
                            </div>
                            <div className={styles.userDetail}>
                                <FiPhone className={styles.userDetailIcon} />{u.phone || '—'}
                            </div>
                            <div className={styles.userDetail}>
                                <FiCalendar className={styles.userDetailIcon} />Joined {u.createdAt}
                            </div>
                        </div>

                        <div className={styles.userActions}>
                            <button
                                className={`${styles.statusToggle} ${u.isActive ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => toggleUserStatus(u.id)}
                            >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(u)}>
                                <FiTrash2 size={13} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add User Modal */}
            {showAddForm && (
                <div className={styles.formOverlay} onClick={() => setShowAddForm(false)}>
                    <div className={styles.formModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>Add New User</span>
                            <button className={styles.formCloseBtn} onClick={() => setShowAddForm(false)}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className={styles.formBody}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Full Name *</label>
                                    <input
                                        className={styles.formInput}
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Email *</label>
                                    <input
                                        className={styles.formInput}
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Phone</label>
                                    <input
                                        className={styles.formInput}
                                        value={newUser.phone}
                                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Role *</label>
                                    <select
                                        className={styles.formInput}
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        required
                                    >
                                        {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Password *</label>
                                    <input
                                        className={styles.formInput}
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formFooter}>
                                <button type="button" className={styles.formCancelBtn} onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.formSubmitBtn}>Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
