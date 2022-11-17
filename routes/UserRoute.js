import express from "express";
import {
  registerUser,
  loginUser,
  loginWithToken,
  userDetails,
  followUser,
  unfollowUser,
  logOut,
} from "../controllers/UserController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.route("/authenticate").post(loginUser).get(loginWithToken);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.get("/user", protect, userDetails);
router.get("/logOut", protect, logOut);

export default router;
