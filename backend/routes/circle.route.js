import express from 'express';
import { createCircle, getUserCircles } from '../controllers/circle.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { get } from 'mongoose';

const router = express.Router();

router.route('/create').post(isAuthenticated, createCircle);
router.route('/').get(isAuthenticated, getUserCircles);

export default router;