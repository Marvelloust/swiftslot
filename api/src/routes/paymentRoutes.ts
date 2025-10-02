import express from 'express';
import { initializePayment, handleWebhook } from '../controllers/paymentController';

const router = express.Router();

router.post('/initialize', initializePayment);
router.post('/webhook', handleWebhook);

export default router;
