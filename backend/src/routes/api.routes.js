import express from 'express';
import { analyzeListing } from '../controllers/analyze.controller.js';
import { getTimeline } from '../controllers/timeline.controller.js';
import { getCompetitors } from '../controllers/competitors.controller.js';
import { handleChat } from '../controllers/chat.controller.js';
import { analyzeSchema, chatSchema } from '../validations/analyze.schema.js';

const router = express.Router();

// Validate request body against a Zod schema
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body });
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.errors?.[0]?.message || 'Validation failed' });
  }
};

router.get('/test', (req, res) => {
  res.json({ message: 'API working ✅' });
});

router.post('/analyze',     validate(analyzeSchema), analyzeListing);
router.post('/timeline',    validate(analyzeSchema), getTimeline);
router.post('/competitors', validate(analyzeSchema), getCompetitors);
router.post('/chat',        validate(chatSchema),    handleChat);

export default router;