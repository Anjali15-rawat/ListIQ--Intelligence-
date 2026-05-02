import { rainforest } from '../providers/rainforest.js';

function generateTimeline(productData) {
  const rating = productData.rating || 4.0;
  const reviewCount = productData.reviewsCount || 0;

  // Generate 7 months of realistic sentiment data based on actual rating
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  // Last 7 months ending at the current month
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
    return MONTH_NAMES[d.getMonth()];
  });
  const basePositive = Math.round(rating * 18); // 4.5★ → ~81%

  const sentimentTrend = months.map((month, i) => {
    // Add slight variation per month
    const variation = (Math.sin(i * 1.3) * 8) | 0;
    const positive = clamp(basePositive + variation, 40, 95);
    const negative = clamp(100 - positive - 10, 5, 40);
    return { month, positive, negative };
  });

  const emergingIssues = [];
  if (rating < 4.5) emergingIssues.push({ issue: 'Product quality concerns', trend: '+45%', severity: 'medium' });
  if (rating < 4.0) emergingIssues.push({ issue: 'Delivery/packaging complaints', trend: '+120%', severity: 'high' });
  if (reviewCount < 200) emergingIssues.push({ issue: 'Low review velocity', trend: '-10%', severity: 'low' });
  emergingIssues.push({ issue: 'Competitor pricing pressure', trend: '+30%', severity: 'low' });

  const verdictMap =
    rating >= 4.5 ? 'mostly positive' :
    rating >= 4.0 ? 'generally positive with some concerns' :
    'mixed with notable negative feedback';

  return {
    sentimentTrend,
    emergingIssues: emergingIssues.slice(0, 3),
    summary: `Customer sentiment for "${productData.title?.slice(0, 50) || 'this product'}" has been ${verdictMap} over the last 7 months. With a ${rating}★ average across ${reviewCount.toLocaleString()} reviews, the listing shows ${rating >= 4.2 ? 'stable performance' : 'room for improvement'}.`,
    suggested: [
      'Respond to all 1-3 star reviews within 48 hours to show buyer care',
      'Add FAQ section addressing the top 3 recurring concerns',
      `${rating < 4.3 ? 'Investigate and address the root cause of negative reviews' : 'Maintain quality control to sustain current rating'}`,
    ]
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export const timelineService = {
  async analyzeTimeline(url) {
    console.log('📅 [Timeline] Analyzing for:', url.slice(0, 60));
    const productData = await rainforest.getProductData(url);
    const result = generateTimeline(productData);
    console.log('✅ [Timeline] Done');
    return result;
  }
};
