import { Router } from 'express';
import { register, login, me } from './auth.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;