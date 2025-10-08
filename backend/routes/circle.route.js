import express from 'express';
import { createCircle } from '../controllers/circle.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/create').post(isAuthenticated, createCircle);

export default router;