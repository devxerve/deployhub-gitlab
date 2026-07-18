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

// ---- Google ----
// 1. El usuario hace clic en "Entrar con Google" → frontend llama a esta ruta
router.get('/google', googleRedirect);
// 2. Google redirige aquí tras el consentimiento
router.get('/google/callback', googleCallback);

// ---- GitHub ----
router.get('/github', githubRedirect);
router.get('/github/callback', githubCallback);

// ---- 42 Intra ----
router.get('/42', intraRedirect);
router.get('/42/callback', intraCallback);

export default router;
