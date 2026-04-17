
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


// fetch all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// delete user (permanently)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await adminService.deleteUser(userId);
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// update user
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const updatedUser = await adminService.updateUser(userId, data);
        
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

// fetch all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await adminService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// fetch all tickets
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await adminService.getAllTickets();
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};