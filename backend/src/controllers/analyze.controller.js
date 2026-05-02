import { analyzeService } from '../services/analyze.service.js';

export const analyzeListing = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const data = await analyzeService.analyzeListing(url);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ [Controller] analyzeListing error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Analysis failed',
    });
  }
};