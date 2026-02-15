import express from 'express';
import paymeeWebhook from './paymeeWebhook.js';

const router=express.Router();

//route for Paymee webhook, this is the endpoint that Paymee will call to notify us about the payment status
router.post('/paymee',paymeeWebhook);

export default router;
