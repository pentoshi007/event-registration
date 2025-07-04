import { Router } from 'express';
import eventsRouter from './events';
import newsletterRouter from './newsletter';
import registrationsRouter from './registrations';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Evently API is running');
});

router.use('/events', eventsRouter);
router.use('/newsletter', newsletterRouter);
router.use('/registrations', registrationsRouter);

export default router; 