
import * as adminService from '../services/admin.service.js';

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};

export const createController = async (req, res) => {
    try {
        const newController = await adminService.createController(req.body);
        
        res.status(201).json({
            message: 'Controller created successfully',
            controller: newController
        });
    } catch (err) {
        console.error('Error creating controller:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};