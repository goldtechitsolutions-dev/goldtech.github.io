const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const upload = require('../services/uploadService');

// Get all applications
router.get('/', async (req, res) => {
    try {
        const apps = await Application.findAll({ order: [['createdAt', 'DESC']] });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add an application with resume upload
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const applicationData = {
            ...req.body,
            resume: req.file ? req.file.location : null // S3 file URL
        };
        const newApp = await Application.create(applicationData);
        res.status(201).json(newApp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an application
router.put('/:id', async (req, res) => {
    try {
        await Application.update(req.body, {
            where: { id: req.params.id }
        });
        const updated = await Application.findByPk(req.params.id);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an application
router.delete('/:id', async (req, res) => {
    try {
        await Application.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Application deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
