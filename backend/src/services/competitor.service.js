import { rainforest } from '../providers/rainforest.js';
import { ai } from '../providers/ai.js';
import config from '../config/index.js';
import fetch from 'node-fetch';

function buildSearchQuery(title = '') {
  const cleaned = title
    .replace(/\([^)]+\)/g, '')
    .replace(/[|,\-–]/g, ' ')
    .replace(/\b[A-Z0-9]{5,}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(w => w.length > 2).slice(0, 5);
  return words.join(' ');
}

function scoreProduct(product) {
  const rating = product.rating || 0;
  const reviews = product.ratings_total || product.reviews_count || 0;
  let score = 30;
  if (rating >= 4.5) score += 30;
  else if (rating >= 4.0) score += 22;
  else if (rating >= 3.5) score += 14;
  else score += 6;

  if (reviews >= 5000) score += 25;
  else if (reviews >= 1000) score += 18;
  else if (reviews >= 500) score += 12;
  else if (reviews >= 100) score += 7;
  else score += 2;

  if ((product.title || '').length > 40) score += 10;
  return Math.min(score, 98);
}

function estimateRevenue(priceStr, reviewsCount) {
  const price = parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 25;
  // Use a more aggressive multiplier for monthly sales based on total reviews
  const estimatedSales = Math.max(Math.round(reviewsCount * 0.85), 50); 
  return Math.round(estimatedSales * price);
}

function generateFallbackCompetitors(productData) {
  const price  = parseFloat(productData.price) || 25;
  const rating = productData.rating || 4.0;
  const curr   = productData.currency?.symbol || '$';
  const titleWords = (productData.title || '').split(' ').filter(w => w.length > 3 && !w.toLowerCase().includes(productData.brand?.toLowerCase() || 'xyz')).slice(0, 2);
  const categoryName = titleWords.join(' ') || 'Product';

  const archetypes = [
    { brand: 'ApexBrands', suffix: 'Pro',         mult: 1.25, rd: +0.3, rm: 3.5, s: ['Dominant market share','A+ content mastery'], w: ['Premium pricing'], img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', reason: 'Unmatched brand authority and 10x higher review velocity than average listings.' },
    { brand: 'ValueBasics', suffix: 'Essentials',       mult: 0.75, rd: -0.5, rm: 0.9, s: ['Aggressive pricing','High turnover'], w: ['Basic packaging'], img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', reason: 'Capture price-sensitive buyers by stripping away non-essential luxury features.' },
    { brand: 'DuraTech', suffix: 'Performance Plus',  mult: 1.10, rd: +0.2, rm: 2.2, s: ['Superior build quality'], w: ['Limited stock'], img: 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=400&q=80', reason: 'Focus on durability and professional-grade materials that outlast the competition.' },
    { brand: 'Lumina', suffix: 'Elite Choice',      mult: 1.00, rd: +0.1, rm: 1.8, s: ['Modern aesthetic','Gift-ready'], w: ['Niche appeal'], img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', reason: 'Target lifestyle-conscious consumers with sleek design and premium unboxing experience.' },
  ];

  return archetypes.map(a => {
    const rReviews = Math.round((productData.reviewsCount || 100) * a.rm + 150);
    const rPriceStr = `${curr}${(price * a.mult).toFixed(2)}`;
    return {
      name:      `${a.brand} ${categoryName} ${a.suffix}`,
      asin:      `B09${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      price:     rPriceStr,
      score:     Math.max(Math.min(Math.round(rating * 19 + (a.rd * 10)), 98), 30),
      rating:    Math.max(Math.min(parseFloat((rating + a.rd).toFixed(1)), 5.0), 1.0),
      reviews:   rReviews,
      estimatedRevenue: estimateRevenue(rPriceStr, rReviews),
      image:     a.img,
      strengths:  a.s,
      weaknesses: a.w,
      whyBetter:  a.reason,
      isReal:    false,
    };
  });
}

async function fetchRealCompetitors(productData) {
  const query  = buildSearchQuery(productData.title);
  const domain = productData._domain || 'amazon.com';
  const curr   = productData.currency?.symbol || '$';

  console.log(`🔍 [Competitors] Searching real products: "${query}" on ${domain}`);

  const params = new URLSearchParams({
    api_key:       config.rainforestKey,
    type:          'search',
    amazon_domain: domain,
    search_term:   query,
  });

  const res  = await fetch(`https://api.rainforestapi.com/request?${params}`);
  const data = await res.json();

  if (!res.ok || !data.search_results?.length) return null;

  const brandWord = (productData.title || '').split(' ')[0]?.toLowerCase();

  const results = data.search_results
    .filter(r => {
      if (r.asin === productData.asin || !r.title || !r.rating) return false;
      const rBrand = (r.brand || '').toLowerCase();
      const rTitle = r.title.toLowerCase();
      // Filter out same brand
      if (brandWord && rTitle.includes(brandWord) && brandWord.length > 2) return false;
      if (productData.brand && rBrand && rBrand === productData.brand.toLowerCase()) return false;
      return true;
    })
    .slice(0, 8);

  if (results.length < 2) return null;

  return results.map((r) => {
    const rPrice = r.price?.value ?? r.buybox_winner?.price?.value;
    const rRating = r.rating ?? 0;
    const rReviews = r.ratings_total ?? 0;
    const rPriceStr = rPrice != null ? `${curr}${rPrice}` : '—';

    const strengths = [];
    const weaknesses = [];
    if (rRating >= 4.3) strengths.push(`Strong ${rRating}★ rating`);
    else weaknesses.push(`Lower ${rRating}★ rating`);
    if (rReviews >= 1000) strengths.push(`${rReviews.toLocaleString()} verified reviews`);
    else if (rReviews < 100) weaknesses.push('Low review count');

    return {
      name:      r.title?.slice(0, 55) + (r.title?.length > 55 ? '…' : ''),
      asin:      r.asin,
      price:     rPriceStr,
      score:     scoreProduct(r),
      rating:    rRating,
      reviews:   rReviews,
      estimatedRevenue: estimateRevenue(rPriceStr, rReviews),
      image:     r.image,
      strengths:  strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      isReal:    true,
    };
  });
}

async function fetchReviewsForAnalysis(asin, domain) {
  const params = new URLSearchParams({
    api_key: config.rainforestKey,
    type: 'reviews',
    asin,
    amazon_domain: domain,
    sort_by: 'helpful'
  });
  try {
    const res = await fetch(`https://api.rainforestapi.com/request?${params}`);
    const data = await res.json();
    return (data.reviews || []).map(r => `[${r.rating}★] ${r.title}: ${r.body}`).join('\n');
  } catch (e) {
    return '';
  }
}

async function generateMarketAnalysis(targetProduct, competitors) {
  const hasAiKey = !!(process.env.OPENAI_API_KEY);
  if (!hasAiKey) {
    return generateMockAnalysis(targetProduct);
  }

  try {
    console.log('🤖 [Competitors] Generating Market AI Analysis...');
    
    const competitorSummary = competitors.map(c => 
      `- ${c.name}: ${c.rating}★, ${c.reviews} reviews, Price: ${c.price}, Est. Monthly Rev: $${c.estimatedRevenue}`
    ).join('\n');

    const systemPrompt = `You are an elite Amazon business strategist.
Analyze this product market in extreme depth. Focus on market psychology, competitive advantages, and revenue growth.

Return EXACTLY this JSON structure (no markdown, no code blocks):
{
  "purchaseCriteria": [
    { "factor": "String", "importance": "High|Medium", "description": "String (deep psychological driver)" }
  ],
  "commonComplaints": ["Detailed String about what makes buyers quit"],
  "commonPraises": ["Detailed String about what creates viral satisfaction"],
  "comparison": "Detailed analysis (4-6 sentences) comparing the main product to the market landscape, identifying exactly where it ranks and why.",
  "suggestions": ["Strategic, actionable advice to dominate the niche (not generic)"]
}`;

    const userPrompt = `Target Product: ${targetProduct.title}
Price: ${targetProduct.price ?? 'N/A'} | Rating: ${targetProduct.rating} | Reviews: ${targetProduct.reviewsCount}

Competitors:
${competitorSummary}

Perform a deep-dive analysis. Identify the "missing link" in this market. Why do people choose the #1 seller over the target product? What is the hidden pain point?`;

    const analysis = await ai.generateMarketResponse(systemPrompt, userPrompt);
    
    return {
      purchaseCriteria: (analysis.purchaseCriteria || []).slice(0, 3),
      commonComplaints: (analysis.commonComplaints || []).slice(0, 4),
      commonPraises: (analysis.commonPraises || []).slice(0, 4),
      comparison: analysis.comparison || "Target product fits within market averages.",
      suggestions: (analysis.suggestions || []).slice(0, 5)
    };

  } catch (e) {
    console.warn("⚠️ AI Market Analysis failed:", e.message);
    return generateMockAnalysis(targetProduct);
  }
}

function generateMockAnalysis(targetProduct) {
  const title = (targetProduct.title || '').toLowerCase();
  const category = title.includes('tiffin') ? 'Kitchenware' : title.includes('sandal') ? 'Fashion/Footwear' : 'Consumer Goods';
  
  return {
    purchaseCriteria: [
      { factor: "Brand Trust", importance: "High", description: `In the ${category} segment, buyers prioritize verified durability and long-term material integrity above all else.` },
      { factor: "Visual Presentation", importance: "High", description: "High-quality lifestyle imagery that demonstrates the product in actual use cases significantly boosts conversion." },
      { factor: "Price Justification", importance: "Medium", description: "Buyers will pay a premium if the listing clearly articulates superior ergonomics or proprietary features." },
    ],
    commonComplaints: [
      "Materials felt cheaper than they appeared in the professional renders",
      "Sizing or dimensions were inconsistent with the provided charts",
      "Packaging was insufficient for long-distance transit, leading to minor scuffs",
      "Delayed response from seller when inquiring about warranty specifics"
    ],
    commonPraises: [
      "Exceptional tactile feel and weight, indicating high-grade construction",
      "Exceeded expectations for aesthetic appeal in person",
      "Solves the primary pain point much more elegantly than previous versions",
      "The unboxing experience felt premium and gift-worthy"
    ],
    comparison: `Your product (${targetProduct.title?.slice(0, 35)}...) is currently positioned as a mid-tier offering. While your rating is stable, you are losing approximately 40% of potential conversions to 'Titan Pro' archetypes due to their superior social proof and A+ content depth. Your pricing is competitive, but your review velocity is significantly below the category benchmark.`,
    suggestions: [
      "Execute a 'Review Refresh' campaign to push recent positive sentiment to the top.",
      "A/B test your main image against a lifestyle shot with high-contrast backgrounds.",
      "Incorporate 'Comparison Charts' in your A+ content to explicitly highlight your material advantage over budget clones.",
      "Implement a loyalty or 'Warranty Registration' insert to build a direct customer relationship.",
      "Analyze the top 5 negative reviews of your #1 competitor and rewrite your second bullet point to address those specific gaps."
    ]
  };
}

export const competitorService = {
  async analyzeCompetitors(url) {
    console.log('🕵️ [Competitors] Analyzing:', url.slice(0, 60));
    const productData = await rainforest.getProductData(url);

    try { productData._domain = new URL(url).hostname.replace('www.', ''); }
    catch (_) { productData._domain = 'amazon.com'; }

    let competitors = null;
    if (config.rainforestKey) {
      try { competitors = await fetchRealCompetitors(productData); }
      catch (err) { console.warn('⚠️ [Competitors] Real search failed:', err.message); }
    }
    if (!competitors || competitors.length < 2) {
      competitors = generateFallbackCompetitors(productData);
    }

    const mainPriceStr = productData.price != null ? `${productData.currency?.symbol || '$'}${productData.price}` : '$25';
    const mainRev = estimateRevenue(mainPriceStr, productData.reviewsCount || 0);

    const marketAnalysis = await generateMarketAnalysis(productData, competitors);

    console.log(`✅ [Competitors] Complete. ${competitors.length} competitors found.`);
    
    return {
      competitors,
      mainProduct: {
        ...productData,
        estimatedRevenue: mainRev
      },
      marketAnalysis
    };
  }
};
