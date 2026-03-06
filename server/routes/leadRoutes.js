const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   GET /api/leads
// @desc    Get all leads
// @access  Public (in real app, protect this)
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();
        res.status(200).json({ success: true, count: leads.length, data: leads });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route   POST /api/leads
// @desc    Create new lead
// @access  Public
router.post('/', async (req, res) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
