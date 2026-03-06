const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the lead'],
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    course: {
        type: String,
        required: [true, 'Please state the interested course'],
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Converted'],
        default: 'New',
    },
    message: {
        type: String,
        maxlength: [500, 'Message can not be more than 500 characters'],
    },
    remarks: [{ // Remarks history
        date: Date,
        response: String,
        nextFollowUp: String,
        note: String
    }],
    followUpDate: {
        type: String, // Or Date, frontend sends formatted strings
    },
    source: {
        type: String,
        default: 'Website',
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Lead', LeadSchema);
