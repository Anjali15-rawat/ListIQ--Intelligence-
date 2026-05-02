import { asyncHandler } from '../middlewares/asyncHandler.js';
import { competitorService } from '../services/competitor.service.js';

export const getCompetitors = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const data = await competitorService.analyzeCompetitors(url);
  
  res.status(200).json({
    success: true,
    data,
  });
});
