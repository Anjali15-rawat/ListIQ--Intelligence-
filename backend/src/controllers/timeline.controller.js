import { asyncHandler } from '../middlewares/asyncHandler.js';
import { timelineService } from '../services/timeline.service.js';

export const getTimeline = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const data = await timelineService.analyzeTimeline(url);
  
  res.status(200).json({
    success: true,
    data,
  });
});
