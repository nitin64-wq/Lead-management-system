const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const mockUsers = [
    {
        name: 'Nitin Kumar',
        email: 'admin@lms.com',
        password: 'admin123',
        role: 'admin',
    },
    {
        name: 'Priya Sharma',
        email: 'priya@lms.com',
        password: 'sales123',
        role: 'user', // Adjusted roles to match schema enum ['user', 'admin']
    },
    {
        name: 'Rahul Verma',
        email: 'rahul@lms.com',
        password: 'sales123',
        role: 'user',
    },
    {
        name: 'Anjali Gupta',
        email: 'anjali@lms.com',
        password: 'manager123',
        role: 'user',
    },
];

const mockLeads = [
    {
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul.s@gmail.com',
        course: 'Full Stack Development',
        source: 'Website',
        status: 'New',
        assignedTo: null,
        remarks: [],
        followUpDate: null,
    },
    {
        name: 'Sneha Patel',
        phone: '9876543221',
        email: 'sneha.p@gmail.com',
        course: 'MERN Stack',
        source: 'Facebook',
        status: 'Interested', // Valid enum values ['New', 'Contacted', 'Interested', 'Not Interested', 'Converted']
        remarks: [],
        followUpDate: null,
    },
];

// Import data into DB
const importData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        // Create users
        const createdUsers = await User.insertMany(mockUsers);

        // Maps leads assignedTo based on previous data
        const priyaUser = createdUsers.find(u => u.email === 'priya@lms.com');

        mockLeads[1].assignedTo = priyaUser._id;

        await Lead.insertMany(mockLeads);

        console.log('Data Imported successfully into MongoDB...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        console.log('Data Destroyed from MongoDB...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
