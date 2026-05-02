import { rainforest } from '../providers/rainforest.js';
import config from '../config/index.js';

// Extract a clean 3-5 word search query from the product title
function buildSearchQuery(title = '') {
  // Remove ASIN-style codes, special chars, and very long words
  const cleaned = title
    .replace(/\([^)]+\)/g, '')   // remove parentheticals
    .replace(/[|,\-–]/g, ' ')    // replace separators
    .replace(/\b[A-Z0-9]{5,}\b/g, '') // remove model codes
    .replace(/\s+/g, ' ')
    .trim();

  // Take first 5 meaningful words
  const words = cleaned.split(' ').filter(w => w.length > 2).slice(0, 5);
  return words.join(' ');
}

// Score a search result product similar to localAnalysis
function scoreProduct(product) {
  const rating = product.rating || 0;
  const reviews = product.ratings_total || product.reviews_count || 0;
  const hasTitle = (product.title || '').length > 40;

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

  if (hasTitle) score += 10;
  return Math.min(score, 98);
}

// Fallback generated competitors
function generateFallbackCompetitors(productData) {
  const price  = parseFloat(productData.price) || 25;
  const rating = productData.rating || 4.0;
  const curr   = productData.currency?.symbol || '$';

  const archetypes = [
    { suffix: 'Elite Series',  mult: 1.18, rd: +0.2, rm: 2.1, s: ['High review volume','Strong A+ content','Established brand'], w: ['Higher price','Slower delivery mentioned'] },
    { suffix: 'ValuePick',     mult: 0.78, rd: -0.5, rm: 0.6, s: ['Lowest price','Wide availability'],                       w: ['No premium packaging','Sparse bullets','Durability concerns'] },
    { suffix: 'MaxPlus',       mult: 0.94, rd: -0.1, rm: 1.4, s: ['Good value-to-quality','Strong images'],                  w: ['No A+ content','Slow review responses'] },
    { suffix: 'ProX',          mult: 1.06, rd: +0.1, rm: 1.7, s: ['Great unboxing shots','Active Q&A'],                      w: ['Higher price hesitation','Limited variants'] },
    { suffix: 'LiteBudget',    mult: 0.85, rd: -0.3, rm: 0.9, s: ['Entry-level option','Good keyword rank'],                 w: ['Missing specs','No video content','Unclear warranty'] },
  ];

  return archetypes.map(a => ({
    name:      `Competitor ${a.suffix}`,
    price:     `${curr}${(price * a.mult).toFixed(0)}`,
    score:     Math.max(Math.min(Math.round(rating * 19 + (a.rd * 10)), 98), 30),
    rating:    Math.max(Math.min(parseFloat((rating + a.rd).toFixed(1)), 5.0), 1.0),
    reviews:   Math.round((productData.reviewsCount || 100) * a.rm + 80),
    strengths:  a.s,
    weaknesses: a.w,
    isReal:    false,
  }));
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

  if (!res.ok || !data.search_results?.length) {
    console.warn('⚠️ [Competitors] Search returned no results, using fallback');
    return null;
  }

  // Filter out the product itself and pick up to 5
  const results = (data.search_results || [])
    .filter(r => r.asin !== productData.asin && r.title && r.rating)
    .slice(0, 5);

  if (results.length < 2) return null;

  return results.map((r, i) => {
    const rPrice = r.price?.value ?? r.buybox_winner?.price?.value;
    const rRating = r.rating ?? 0;
    const rReviews = r.ratings_total ?? 0;

    // Derive strengths/weaknesses from real data
    const strengths = [];
    const weaknesses = [];

    if (rRating >= 4.3) strengths.push(`Strong ${rRating}★ rating`);
    else weaknesses.push(`Lower ${rRating}★ rating vs category average`);

    if (rReviews >= 1000) strengths.push(`${rReviews.toLocaleString()} verified reviews`);
    else if (rReviews < 100) weaknesses.push('Low review count — limited social proof');

    if (rPrice != null && productData.price != null) {
      const diff = ((rPrice - productData.price) / productData.price * 100).toFixed(0);
      if (diff > 10) weaknesses.push(`${diff}% more expensive than your listing`);
      else if (diff < -10) strengths.push(`${Math.abs(diff)}% cheaper — price advantage`);
      else strengths.push('Similar price point — direct head-to-head');
    }

    if (r.is_prime) strengths.push('Prime eligible — faster delivery');
    if (r.sponsored) weaknesses.push('Sponsored position — paid visibility only');
    if (strengths.length === 0) strengths.push('Active listing on the same search page');
    if (weaknesses.length === 0) weaknesses.push('No obvious listing weaknesses detected');

    return {
      name:      r.title?.slice(0, 55) + (r.title?.length > 55 ? '…' : ''),
      asin:      r.asin,
      price:     rPrice != null ? `${curr}${rPrice}` : '—',
      score:     scoreProduct(r),
      rating:    rRating,
      reviews:   rReviews,
      image:     r.image,
      strengths:  strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      isReal:    true,
    };
  });
}

export const competitorService = {
  async analyzeCompetitors(url) {
    console.log('🕵️ [Competitors] Analyzing:', url.slice(0, 60));
    const productData = await rainforest.getProductData(url);

    // Attach domain for search
    try {
      productData._domain = new URL(url).hostname.replace('www.', '');
    } catch (_) { productData._domain = 'amazon.com'; }

    let competitors = null;

    if (config.rainforestKey) {
      try {
        competitors = await fetchRealCompetitors(productData);
      } catch (err) {
        console.warn('⚠️ [Competitors] Real search failed:', err.message);
      }
    }

    if (!competitors || competitors.length < 2) {
      console.log('📦 [Competitors] Using generated fallback');
      competitors = generateFallbackCompetitors(productData);
    }

    console.log(`✅ [Competitors] ${competitors.length} competitors (real: ${competitors.filter(c => c.isReal).length})`);
    return competitors;
  }
};
