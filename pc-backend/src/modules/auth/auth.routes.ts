import { Router } from 'express';
import { register, login, me } from './auth.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { authenticate } from '../../middlewares/auth.middleware';
import { registerRateLimit, loginRateLimit } from '../../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', registerRateLimit(), validateBody(registerSchema), register);
router.post('/login', loginRateLimit(), validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
