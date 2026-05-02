import config from '../config/index.js';

const DOMAIN_CURRENCY = {
  'amazon.in':     { symbol: '₹', code: 'INR' },
  'amazon.co.uk':  { symbol: '£', code: 'GBP' },
  'amazon.de':     { symbol: '€', code: 'EUR' },
  'amazon.fr':     { symbol: '€', code: 'EUR' },
  'amazon.es':     { symbol: '€', code: 'EUR' },
  'amazon.it':     { symbol: '€', code: 'EUR' },
  'amazon.co.jp':  { symbol: '¥', code: 'JPY' },
  'amazon.ca':     { symbol: 'CA$', code: 'CAD' },
  'amazon.com.au': { symbol: 'A$', code: 'AUD' },
  'amazon.com':    { symbol: '$', code: 'USD' },
};

function getCurrency(domain) {
  return DOMAIN_CURRENCY[domain] || { symbol: '$', code: 'USD' };
}

function extractAsin(url) {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

const NEGATIVE_KW = /poor|bad|worst|terrible|broken|defect|disappoint|fake|useless|waste|return|refund|cheap quality|broke|stop working|fail|issue|problem|not work|doesn.t work|not good|low quality|awful|horrible|pathetic|mislead|overpriced|damaged|missing/i;
const POSITIVE_KW = /excellent|amazing|great|love|perfect|best|highly recommend|fantastic|awesome|outstanding|superb|brilliant|impressed|happy|satisfied|worth|value|quality|durable|solid/i;

function extractComplaints(reviews = []) {
  const complaints = [];
  for (const review of reviews) {
    const text = (review.body || review.text || review.content || '').trim();
    const rating = review.rating || review.star_rating || 5;
    if (text.length > 20 && (rating <= 2 || (rating <= 3 && NEGATIVE_KW.test(text)))) {
      const sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 20);
      const best = sentences.find(s => NEGATIVE_KW.test(s)) || sentences[0];
      if (best) complaints.push(best.slice(0, 130));
    }
    if (complaints.length >= 5) break;
  }
  return complaints;
}

function extractPraises(reviews = []) {
  const praises = [];
  for (const review of reviews) {
    const text = (review.body || review.text || review.content || '').trim();
    const rating = review.rating || review.star_rating || 0;
    // Only pick genuinely positive reviews (4-5 stars with positive language)
    if (text.length > 20 && rating >= 4 && POSITIVE_KW.test(text)) {
      const sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 20);
      const best = sentences.find(s => POSITIVE_KW.test(s)) || sentences[0];
      if (best) praises.push(best.slice(0, 130));
    }
    if (praises.length >= 4) break;
  }
  return praises;
}

function buildMockProduct(url, asin, domain) {
  const currency = getCurrency(domain);
  const urlLower = url.toLowerCase();
  let category = 'Product';
  if (urlLower.match(/phone|mobile|smartphone/)) category = 'Smartphone';
  else if (urlLower.match(/laptop|computer|pc/)) category = 'Laptop';
  else if (urlLower.match(/earphone|headphone|earbud/)) category = 'Audio Device';
  else if (urlLower.match(/watch|band|tracker/)) category = 'Smartwatch';
  else if (urlLower.match(/bag|backpack/)) category = 'Bag';
  else if (urlLower.match(/bottle|container|tiffin/)) category = 'Kitchen Product';

  return {
    title: `Amazon ${category} (ASIN: ${asin || 'N/A'})`,
    price: 29.99,
    currency,
    rating: 4.1,
    reviewsCount: 0,
    features: ['Quality build', 'Customer-friendly design', 'Competitive pricing'],
    reviews: [],
    complaints: [],
    image: null,
    asin: asin || null,
    bsr: null,
    _isMock: true,
  };
}

export const rainforest = {
  async getProductData(url) {
    console.log('🌿 [Rainforest] Fetching:', url.slice(0, 80));

    const asin = extractAsin(url);
    let domain = 'amazon.com';
    try { domain = new URL(url).hostname.replace('www.', ''); } catch (_) {}

    const currency = getCurrency(domain);

    const params = asin
      ? new URLSearchParams({ api_key: config.rainforestKey, type: 'product', asin, amazon_domain: domain })
      : new URLSearchParams({ api_key: config.rainforestKey, type: 'product', url });

    const apiUrl = `https://api.rainforestapi.com/request?${params}`;
    console.log('🌿 [Rainforest] ASIN:', asin, '| Domain:', domain, '| Currency:', currency.symbol);

    let data;
    try {
      const response = await fetch(apiUrl);
      data = await response.json();
      if (!response.ok) {
        console.warn('⚠️ [Rainforest] HTTP', response.status, '→ using mock');
        return buildMockProduct(url, asin, domain);
      }
    } catch (fetchErr) {
      console.warn('⚠️ [Rainforest] Network error → using mock');
      return buildMockProduct(url, asin, domain);
    }

    if (!data?.product) {
      const msg = data?.message || 'no product';
      console.warn(`⚠️ [Rainforest] ${msg} (credits: ${data?.request_info?.credits_remaining ?? '?'}) → using mock`);
      return buildMockProduct(url, asin, domain);
    }

    const p = data.product;
    const reviews = p.reviews || p.top_reviews || [];
    const complaints = extractComplaints(reviews);
    const praises    = extractPraises(reviews);

    const product = {
      title: p.title || 'Unknown Product',
      price: p.price?.value ?? p.buybox_winner?.price?.value ?? null,
      currency,
      rating: p.rating ?? null,
      reviewsCount: p.reviews_count ?? 0,
      features: p.feature_bullets || p.highlights || [],
      reviews,
      complaints,
      praises,
      image: p.main_image?.link ?? p.images?.[0]?.link ?? null,
      asin: p.asin ?? asin ?? null,
      bsr: p.bestsellers_rank?.[0]
        ? `#${p.bestsellers_rank[0].rank} in ${p.bestsellers_rank[0].category}`
        : null,
    };

    console.log('📦 [Rainforest] Fetched:', product.title, '| Complaints extracted:', complaints.length);
    return product;
  }
};