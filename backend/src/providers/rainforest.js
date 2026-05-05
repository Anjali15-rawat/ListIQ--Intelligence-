import config from '../config/index.js';
import { ai } from './ai.js';

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

async function attemptDirectScrape(url, asin, domain) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  ];

  const headers = {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cookie': 'i18n-prefs=INR; sp-cdn="L5Z9:IN"',
  };

  let body = null;

  // Strategy 1: Direct fetch
  try {
    const res = await fetch(url, { headers });
    if (res.ok) {
      body = await res.text();
      console.log(`🕵️ [DirectScrape] Direct fetch OK, body length: ${body.length}`);
    } else {
      console.warn(`⚠️ [DirectScrape] Direct fetch failed with status: ${res.status}`);
    }
  } catch (e) {
    console.warn(`⚠️ [DirectScrape] Direct fetch error: ${e.message}`);
  }

  // Strategy 2: Use ScraperAPI's free proxy if direct fails or returns captcha
  if (!body || body.includes('captcha') || body.includes('Type the characters') || body.length < 5000) {
    console.log('🔄 [DirectScrape] Attempting proxy-based scrape...');
    try {
      const encodedUrl = encodeURIComponent(url);
      // Use a simple proxy that doesn't require a key for basic requests
      const proxyUrl = `https://api.allorigins.win/get?url=${encodedUrl}`;
      const res = await fetch(proxyUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const json = await res.json();
      if (json?.contents && json.contents.length > 5000) {
        body = json.contents;
        console.log(`✅ [DirectScrape] Proxy fetch OK, body length: ${body.length}`);
      }
    } catch (e) {
      console.warn('⚠️ [DirectScrape] Proxy fetch failed:', e.message);
    }
  }

  if (!body || body.length < 2000) {
    console.warn('❌ [DirectScrape] All scrape strategies failed, building smart mock from URL');
    return await buildMockProduct(url, asin, domain);
  }

  // Deep HTML parsing
  const titlePatterns = [
    /id="productTitle"[^>]*>\s*([^<]{5,300})\s*</i,
    /<span[^>]*class="[^"]*product-title[^"]*"[^>]*>\s*([^<]{5,300})\s*</i,
    /<h1[^>]*id="title"[^>]*>[\s\S]*?<span[^>]*>\s*([^<]{5,300})\s*</i,
  ];
  const pricePatterns = [
    /class="a-price-whole">([0-9,]+)</,
    /"priceAmount":"?([0-9.]+)"?/,
    /class="a-offscreen">(?:₹|Rs\.?\s*)([0-9,]+)/,
    /"price":{"amount":"?([0-9.]+)"?/,
  ];
  const ratingPatterns = [
    /([0-9.]+) out of 5 stars/i,
    /class="a-icon-alt">([0-9.]+) out of/i,
    /"ratingScore":"([0-9.]+)"/,
    /"averageRating":"?([0-9.]+)"?/,
  ];
  const reviewPatterns = [
    /([0-9,]+)\s+(?:global\s+)?ratings?/i,
    /([0-9,]+)\s+customer\s+reviews?/i,
    /"totalReviewCount":([0-9]+)/,
    /"reviewsCount":([0-9]+)/,
    /id="acrCustomerReviewText"[^>]*>([0-9,]+)/i,
  ];
  const imagePatterns = [
    /"hiRes":"(https:\/\/[^"]+\.jpg[^"]*)"/,
    /"large":"(https:\/\/[^"]+\.jpg[^"]*)"/,
    /id="landingImage"[^>]*src="([^"]+)"/i,
    /class="[^"]*main-image[^"]*"[^>]*src="([^"]+)"/i,
    /"imageUrl":"(https:\/\/[^"]+)"/,
  ];
  const bsrPattern = /#([0-9,]+)\s+in\s+([A-Za-z &]+?)(?:\s*<|\s*\()/i;
  const featurePattern = /<li>\s*<span[^>]*class="[^"]*a-list-item[^"]*"[^>]*>\s*([^<]{15,300})\s*<\/span>/gi;

  let title = null, price = null, rating = null, reviewsCount = null, image = null, bsr = null;
  const features = [];

  for (const p of titlePatterns) {
    const m = body.match(p);
    if (m && m[1] && m[1].trim().length > 5) {
      title = m[1].trim().replace(/\s+/g, ' ');
      // Sanitize: remove leading "Https:" artifact
      if (/^https?:/i.test(title)) title = null;
      else break;
    }
  }
  for (const p of pricePatterns) {
    const m = body.match(p);
    if (m) { price = parseFloat(m[1].replace(/,/g, '')); if (price > 0) break; }
  }
  for (const p of ratingPatterns) {
    const m = body.match(p);
    if (m) { rating = parseFloat(m[1]); if (rating > 0 && rating <= 5) break; }
  }
  for (const p of reviewPatterns) {
    const m = body.match(p);
    if (m) { reviewsCount = parseInt(m[1].replace(/,/g, '')); if (reviewsCount > 0) break; }
  }
  for (const p of imagePatterns) {
    const m = body.match(p);
    if (m && m[1]) { image = m[1]; break; }
  }
  const bsrMatch = body.match(bsrPattern);
  if (bsrMatch) bsr = `#${bsrMatch[1]} in ${bsrMatch[2].trim()}`;

  let featureMatch;
  while ((featureMatch = featurePattern.exec(body)) !== null && features.length < 6) {
    const f = featureMatch[1].trim().replace(/\s+/g, ' ');
    if (f.length > 15 && !features.includes(f)) features.push(f);
  }

  // If we got at least a real title or price, return parsed data
  if (title || (price && price > 0)) {
    const currency = getCurrency(domain);
    const effectiveAsin = asin || (body.match(/"asin":"([A-Z0-9]{10})"/) || [])[1] || 'SCRAPED';
    console.log(`✅ [DirectScrape] Extracted → Title: "${title?.slice(0,50)}" | Price: ${price} | Rating: ${rating} | Reviews: ${reviewsCount}`);
    return {
      title: title || buildTitleFromUrl(url),
      price: price || null,
      currency,
      rating: rating || null,
      reviewsCount: reviewsCount || 0,
      features: features.length > 0 ? features : [],
      reviews: [],
      complaints: [],
      praises: [],
      image: image || null,
      asin: effectiveAsin,
      bsr: bsr || null,
      _isScraped: true
    };
  }

  console.warn('⚠️ [DirectScrape] Could not extract meaningful data from page, using smart mock');
  return await buildMockProduct(url, asin, domain);
}

function buildTitleFromUrl(url) {
  try {
    const parts = decodeURIComponent(url).split('/').filter(p =>
      p.length > 5 && !p.match(/^[A-Z0-9]{10}$/) && !['dp','gp','product','www'].includes(p.toLowerCase()) && !p.includes('.')
    );
    if (parts.length > 0) {
      const slug = parts[0].split('?')[0];
      return slug.replace(/[+_\-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
    }
  } catch (e) {}
  return 'Amazon Product';
}



async function buildMockProduct(url, asin, domain) {
  const urlLower = url.toLowerCase();
  const effectiveDomain = urlLower.includes('amazon.in') ? 'amazon.in' : domain;
  const currency = getCurrency(effectiveDomain);
  
  // Use a deterministic seed based on ASIN
  let seed = 0;
  const targetAsin = asin || urlLower.slice(-10);
  for (let i = 0; i < targetAsin.length; i++) {
    seed += targetAsin.charCodeAt(i);
  }
  
  const mockProducts = [
    {
      title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      category: "Electronics", price: 348.00, rating: 4.6, reviewsCount: 15430,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
      features: ["Industry Leading Noise Cancellation", "30-Hour Battery Life", "Speak-to-Chat Technology"],
      complaints: ["App UI is cluttered", "Headband feels tight", "Expensive"],
      praises: ["Amazing sound quality", "Best ANC in the market", "Super fast charging"]
    },
    {
      title: "Ninja AF101 Air Fryer, 4 Qt, 1500W",
      category: "Home & Kitchen", price: 99.99, rating: 4.8, reviewsCount: 42100,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
      features: ["Crisps, Roasts, Reheats, & Dehydrates", "Dishwasher Safe Parts", "Wide Temperature Range"],
      complaints: ["Cord is too short", "Non-stick coating peels", "Loud fan noise"],
      praises: ["Cooks super fast", "Very easy to clean", "Perfect size for two"]
    },
    {
      title: "Optimum Nutrition Gold Standard 100% Whey Protein Powder",
      category: "Health & Household", price: 44.99, rating: 4.7, reviewsCount: 185000,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80",
      features: ["24g of Protein per Serving", "5.5g of BCAAs", "Gluten Free"],
      complaints: ["New formula tastes overly sweet", "Tub is only half full", "Doesn't mix well with milk"],
      praises: ["Great taste", "Excellent macro profile", "Mixes perfectly with water"]
    },
    {
      title: "YETI Rambler 20 oz Tumbler, Stainless Steel",
      category: "Sports & Outdoors", price: 35.00, rating: 4.8, reviewsCount: 135000,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
      features: ["MagSlider Lid", "Double-Wall Vacuum Insulation", "Dishwasher Safe"],
      complaints: ["Lid leaks when tipped", "Does not fit in some cup holders", "Ice melts faster than expected"],
      praises: ["Keeps coffee hot for hours", "Extremely durable", "Beautiful color options"]
    },
    {
      title: "CeraVe Moisturizing Cream | Body and Face Moisturizer",
      category: "Beauty & Personal Care", price: 17.78, rating: 4.8, reviewsCount: 120000,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80",
      features: ["Contains 3 Essential Ceramides", "Hyaluronic Acid to Retain Moisture", "Fragrance Free"],
      complaints: ["Feels a bit greasy on face", "Pump stops working when half empty", "Caused mild breakouts"],
      praises: ["Healed my dry skin", "No strong smell", "Huge tub lasts for months"]
    },
    {
      title: "Dyson V11 Cordless Stick Vacuum",
      category: "Home & Kitchen", price: 499.00, rating: 4.5, reviewsCount: 8900,
      image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
      features: ["Intelligently optimizes suction and run time", "Up to 60 minutes of fade-free power", "Advanced whole-machine filtration"],
      complaints: ["Battery dies too quickly on boost mode", "Heavy to hold for long periods", "Very expensive"],
      praises: ["Incredible suction power", "LCD screen is very helpful", "Picks up pet hair perfectly"]
    },
    {
      title: "Levi's Men's 505 Regular Fit Jeans",
      category: "Clothing", price: 49.99, rating: 4.5, reviewsCount: 95000,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
      features: ["100% Cotton", "Zipper closure", "Extra room in the thigh"],
      complaints: ["Material feels thinner than older versions", "Sizing is inconsistent", "Belt loops break easily"],
      praises: ["Classic comfortable fit", "Great value for the price", "Looks good for casual wear"]
    }
  ];

  const prod = mockProducts[seed % mockProducts.length];

  return {
    title: prod.title,
    price: effectiveDomain === 'amazon.in' ? prod.price * 80 : prod.price, 
    currency,
    rating: prod.rating,
    reviewsCount: prod.reviewsCount, 
    features: prod.features,
    reviews: [],
    complaints: prod.complaints,
    praises: prod.praises,
    image: prod.image,
    asin: asin || targetAsin.substring(0,10).toUpperCase(),
    bsr: '#1,245 in ' + prod.category,
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
      : new URLSearchParams({ api_key: config.rainforestKey, type: 'product', url, amazon_domain: domain });

    const apiUrl = `https://api.rainforestapi.com/request?${params.toString()}`;
    console.log('🌿 [Rainforest] Requesting:', apiUrl.replace(config.rainforestKey, '***'));

    let data;
    try {
      const response = await fetch(apiUrl);
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ [Rainforest] Non-JSON response:', text.slice(0, 200));
        return attemptDirectScrape(url, asin, domain);
      }

      if (!response.ok) {
        console.warn(`⚠️ [Rainforest] API Error (${response.status}):`, data?.request_info?.message || data?.message || 'Unknown');
        console.log('🕵️ [Rainforest] API failed. Attempting direct HTML fallback...');
        return attemptDirectScrape(url, asin, domain);
      }
    } catch (fetchErr) {
      console.warn('⚠️ [Rainforest] Network Error:', fetchErr.message);
      return attemptDirectScrape(url, asin, domain);
    }

    if (!data?.product) {
      console.warn('⚠️ [Rainforest] No product data in response. Full body keys:', Object.keys(data));
      return attemptDirectScrape(url, asin, domain);
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
      buybox: p.buybox_winner ? {
        seller: p.buybox_winner.seller?.name,
        availability: p.buybox_winner.availability?.raw,
        price: p.buybox_winner.price?.value
      } : null,
      hasAplus: !!(p.aplus_content || p.a_plus_content),
      dimensions: p.specifications?.find(s => s.name === 'Product Dimensions')?.value,
      weight: p.specifications?.find(s => s.name === 'Item Weight')?.value,
    };

    console.log('📦 [Rainforest] Fetched:', product.title, '| Complaints extracted:', complaints.length);
    return product;
  }
};