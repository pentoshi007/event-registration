import { Router } from 'express';
import eventsRouter from './events';
import newsletterRouter from './newsletter';
import registrationsRouter from './registrations';
import authRouter from './auth';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Evently API is running');
});

router.use('/auth', authRouter);
router.use('/events', eventsRouter);
router.use('/newsletter', newsletterRouter);
router.use('/registrations', registrationsRouter);

export default router; 