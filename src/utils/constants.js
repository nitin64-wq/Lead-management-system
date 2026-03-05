// ===== User Roles =====
export const ROLES = {
    ADMIN: 'admin',
    SALES: 'sales',
    MANAGER: 'manager',
};

export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.SALES]: 'Sales / Counselor',
    [ROLES.MANAGER]: 'Manager',
};

// ===== Lead Statuses =====
export const LEAD_STATUS = {
    NEW: 'New',
    ASSIGNED: 'Assigned',
    CALL_NOT_PICKED: 'Call Not Picked',
    INTERESTED: 'Interested',
    NOT_INTERESTED: 'Not Interested',
    FOLLOW_UP: 'Follow Up',
    CONVERTED: 'Converted',
    CLOSED: 'Closed',
};

export const LEAD_STATUS_COLORS = {
    [LEAD_STATUS.NEW]: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    [LEAD_STATUS.ASSIGNED]: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
    [LEAD_STATUS.CALL_NOT_PICKED]: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    [LEAD_STATUS.INTERESTED]: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    [LEAD_STATUS.NOT_INTERESTED]: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    [LEAD_STATUS.FOLLOW_UP]: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    [LEAD_STATUS.CONVERTED]: { bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
    [LEAD_STATUS.CLOSED]: { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' },
};

// ===== Call Responses =====
export const CALL_RESPONSES = [
    'Interested',
    'Not Interested',
    'Call Later',
    'Number Busy',
    'Not Reachable',
    'Wrong Number',
    'Switched Off',
];

// ===== Lead Sources =====
export const LEAD_SOURCES = [
    'Website',
    'Facebook',
    'Instagram',
    'Google Ads',
    'Referral',
    'Walk-in',
    'Phone Inquiry',
    'Email',
    'LinkedIn',
    'Other',
];

// ===== Courses =====
export const COURSES = [
    'Full Stack Development',
    'MERN Stack',
    'Data Science',
    'Digital Marketing',
    'Python Programming',
    'Java Development',
    'UI/UX Design',
    'Cloud Computing',
    'Cyber Security',
    'Mobile App Development',
];

// ===== Sidebar Menu =====
export const SIDEBAR_MENU = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: [ROLES.ADMIN, ROLES.SALES, ROLES.MANAGER] },
    { id: 'leads', label: 'Leads', path: '/leads', icon: 'leads', roles: [ROLES.ADMIN, ROLES.SALES, ROLES.MANAGER] },
    { id: 'followups', label: 'Follow Ups', path: '/follow-ups', icon: 'followups', roles: [ROLES.ADMIN, ROLES.SALES, ROLES.MANAGER] },
    { id: 'reports', label: 'Reports', path: '/reports', icon: 'reports', roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { id: 'users', label: 'Users', path: '/users', icon: 'users', roles: [ROLES.ADMIN] },
];
