import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../utils/upload.js";

const router = express.Router();
// router.use(verifyToken);
/* READ */
router.get("/", verifyToken, getFeedPosts);
router.post("/", verifyToken, upload.single("picture"), createPost);
// router.route("/").get(getFeedPosts).post(upload.single("picture"), createPost);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
