import { Router } from 'express';
import {
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
  intraRedirect,
  intraCallback,
} from '../controllers/oauth.controller';

const router = Router();


router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);


router.get('/github', githubRedirect);
router.get('/github/callback', githubCallback);


router.get('/42', intraRedirect);
router.get('/42/callback', intraCallback);

export default router;
