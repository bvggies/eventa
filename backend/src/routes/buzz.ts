import express from 'express';
import {
  getAllPosts,
  getPostById,
  getPostsByHashtag,
  createPost,
  likePost,
  getTrendingHashtags,
} from '../controllers/buzzController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/hashtags/trending', getTrendingHashtags);
router.get('/hashtag/:hashtag', getPostsByHashtag);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.post('/:id/like', authenticate, likePost);

export default router;

