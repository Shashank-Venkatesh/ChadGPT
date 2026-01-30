import express from 'express';
import { getPlans, purchasePlans } from '../controllers/creditController.js';
import {protect} from "../middlewares/authMiddleware.js"

const creditRouter = express.Router();


creditRouter.get('/plan', getPlans)
creditRouter.post('/purchase', protect, purchasePlans)

export default creditRouter