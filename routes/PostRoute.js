import express from "express";
import {
  getSinglePost,
  createPost,
  deletePost,
  getPost,
  likePost,
  unlikePost,
} from "../controllers/PostController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all_posts", protect, getPost);
router.post("/", protect, createPost);
router.route("/:id").get(getSinglePost).delete(protect, deletePost);
router.post("/like/:id", protect, likePost);
router.post("/unlike/:id", protect, unlikePost);

export default router;
