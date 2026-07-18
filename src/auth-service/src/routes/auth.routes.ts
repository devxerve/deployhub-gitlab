import { Router } from 'express';
import { register, login, validate } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validate', validate);

export default router;
