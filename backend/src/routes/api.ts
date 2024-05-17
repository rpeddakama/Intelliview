import { Router } from 'express';

const router = Router();

// Define routes
router.get('/message', (req, res) => {
  res.send('Hello from the API!');
});

export default router;
