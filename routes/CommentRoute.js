import express from "express";
import { createComment } from "../controllers/CommentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/:id', protect, createComment);
export default router;