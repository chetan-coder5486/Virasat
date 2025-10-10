import express from 'express';
import { createCircle, getUserCircles, updateCircle } from '../controllers/circle.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/create').post(isAuthenticated, createCircle);
router.route('/').get(isAuthenticated, getUserCircles);
router.route('/:id').patch(isAuthenticated, updateCircle);


export default router;