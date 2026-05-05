import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.RAINFOREST_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: RAINFOREST_API_KEY is not set in .env");
  process.exit(1);
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

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return 'amazon.com';
  }
}

async function fetchRainforest(params) {
  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    ...params
  });
  const url = `https://api.rainforestapi.com/request?${urlParams}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Rainforest API error: ${response.status}`);
  }
  return await response.json();
}

async function getMainProduct(url) {
  const asin = extractAsin(url);
  const domain = getDomain(url);
  console.log(`\n📦 Fetching main product: ASIN ${asin} from ${domain}...`);
  
  const data = await fetchRainforest({
    type: 'product',
    asin: asin,
    amazon_domain: domain
  });

  if (!data.product) throw new Error("Could not find product data.");

  const p = data.product;
  return {
    asin: p.asin,
    domain: domain,
    title: p.title,
    price: p.price?.value || p.buybox_winner?.price?.value || "N/A",
    rating: p.rating || "N/A",
    reviewsCount: p.reviews_count || 0,
    category: p.bestsellers_rank?.[0]?.category || null,
  };
}

async function getCompetitors(product) {
  console.log(`\n🔍 Searching for competitors in category / related to title...`);
  // Use the first 4 words of the title to find similar products
  const searchTerm = product.title.split(' ').slice(0, 4).join(' ');
  console.log(`   Search term: "${searchTerm}"`);

  const data = await fetchRainforest({
    type: 'search',
    search_term: searchTerm,
    amazon_domain: product.domain,
    sort_by: 'featured'
  });

  if (!data.search_results) return [];

  const competitors = [];
  for (const item of data.search_results) {
    // Skip the main product itself
    if (item.asin === product.asin) continue;
    if (competitors.length >= 8) break; // Limit to 8 (user asked for 5-10)
    
    competitors.push({
      asin: item.asin,
      title: item.title,
      price: item.price?.value || "N/A",
      rating: item.rating || "N/A",
      reviewsCount: item.ratings_total || 0,
    });
  }
  return competitors;
}

async function getReviews(asin, domain, maxReviews = 100) {
  console.log(`\n💬 Fetching up to ${maxReviews} reviews for ASIN ${asin}...`);
  let reviews = [];
  let page = 1;
  
  while (reviews.length < maxReviews) {
    console.log(`   -> Fetching review page ${page}...`);
    try {
      const data = await fetchRainforest({
        type: 'reviews',
        asin: asin,
        amazon_domain: domain,
        review_page: page,
        sort_by: 'helpful' // or 'recent'
      });

      if (!data.reviews || data.reviews.length === 0) {
        console.log(`   -> No more reviews found on page ${page}.`);
        break; // No more reviews
      }

      for (const r of data.reviews) {
        if (reviews.length >= maxReviews) break;
        reviews.push({
          id: r.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          date: r.date?.raw || "N/A",
          verified: r.verified_purchase || false
        });
      }
      
      if (data.pagination && data.pagination.current_page >= data.pagination.total_pages) {
         break;
      }
      
      page++;
    } catch (err) {
      console.log(`   -> Error fetching reviews on page ${page}: ${err.message}`);
      break;
    }
  }
  console.log(`   ✅ Got ${reviews.length} reviews for ASIN ${asin}.`);
  return reviews;
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: node scrape-competitors.js <AMAZON_PRODUCT_URL>");
    process.exit(1);
  }

  try {
    const mainProduct = await getMainProduct(url);
    console.log("Main Product Extracted:", JSON.stringify(mainProduct, null, 2));

    const competitors = await getCompetitors(mainProduct);
    console.log(`Found ${competitors.length} competitors.`);

    // Prepare full results structure
    const results = {
      targetProduct: mainProduct,
      competitors: competitors,
      data: {}
    };

    // 1. Fetch reviews for main product
    results.data[mainProduct.asin] = await getReviews(mainProduct.asin, mainProduct.domain, 100);

    // 2. Fetch reviews for competitors
    for (const comp of competitors) {
      results.data[comp.asin] = await getReviews(comp.asin, mainProduct.domain, 100);
    }

    // Save to file
    const filename = `scraper_results_${mainProduct.asin}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\n🎉 Success! All data written to ${filename}`);
    
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
  }
}

main();
