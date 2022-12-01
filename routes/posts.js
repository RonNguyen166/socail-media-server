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
router.use(verifyToken);
/* READ */
// router.post("/", verifyToken, upload.single("picture"), createPost);
// router.get("/", verifyToken, getFeedPosts);
router.route("/").get(getFeedPosts).post(upload.single("picture"), createPost);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

export default router;
