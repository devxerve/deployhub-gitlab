import { Router } from 'express';
import { register, login, validate, logout, listUsers, deleteUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validate', validate);
router.post('/logout', logout);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

export default router;
