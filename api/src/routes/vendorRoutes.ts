import express from 'express';
import { getVendors, getVendorById, getAvailability } from '../controllers/vendorController';

const router = express.Router();

router.get('/', getVendors);

router.get('/:id', getVendorById);
router.get('/:id/availability', getAvailability);

export default router;
