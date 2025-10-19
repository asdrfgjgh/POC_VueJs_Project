// backend/src/interfaces/tag.routes.ts
import express from 'express';
import { getAllTags } from '../application/tag.service';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).send('Error fetching tags');
  }
});

export default router;