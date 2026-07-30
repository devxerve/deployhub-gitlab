import { Router } from 'express';
import { register, login, validate, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validate', validate);
router.post('/logout', logout);

export default router;
