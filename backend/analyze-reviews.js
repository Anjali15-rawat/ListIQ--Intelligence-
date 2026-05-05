import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is not set in .env");
  process.exit(1);
}

async function analyzeReviews(reviews, productName) {
  console.log(`\n🤖 Analyzing ${reviews.length} reviews for "${productName}" using OpenAI...`);
  
  // Format reviews to reduce token usage
  const formattedReviews = reviews.map((r, i) => 
    `[R${i+1}] Rating: ${r.rating}* | Title: ${r.title} | Body: ${r.body}`
  ).join('\n');

  const systemPrompt = `You are an expert product analyst. Analyze these customer reviews.
Group everything into simple categories and return clear insights.

Return EXACTLY this JSON structure (no markdown, no explanation):
{
  "whatCustomersCareAbout": [
    { "category": "String (e.g., Price, Durability, Battery)", "importance": "High|Medium|Low", "description": "String" }
  ],
  "commonPraises": [
    { "theme": "String", "details": "String" }
  ],
  "commonComplaints": [
    { "theme": "String", "details": "String" }
  ],
  "actionableInsights": [
    "String"
  ]
}`;

  const userPrompt = `Product: ${productName}\n\nReviews:\n${formattedReviews}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: "json_object" }, // ensure json output
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(`OpenAI error: ${data.error?.message || response.statusText}`);
  }

  const rawText = data.choices[0].message.content;
  return JSON.parse(rawText);
}

async function main() {
  const file = process.argv[2];
  
  if (!file) {
    console.error("Usage: node analyze-reviews.js <scraper_results_file.json>");
    console.log("Example: node analyze-reviews.js scraper_results_B08N5WRWNW.json");
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(file, 'utf-8');
    const json = JSON.parse(rawData);

    const targetAsin = json.targetProduct.asin;
    const targetTitle = json.targetProduct.title;
    const allReviews = [];
    for (const asin in json.data) {
      allReviews.push(...json.data[asin]);
    }

    if (allReviews.length === 0) {
      console.error(`❌ No reviews found in the data file.`);
      process.exit(1);
    }

    console.log(`Found a total of ${allReviews.length} reviews across target product and competitors.`);
    // Since combining all might exceed context size, limit to first 300 to be safe (300 reviews * 50 words = 15k tokens)
    const sampleReviews = allReviews.slice(0, 300);

    const analysis = await analyzeReviews(sampleReviews, targetTitle + " and Competitors");
    
    const outputFilename = `analysis_results_${targetAsin}.json`;
    fs.writeFileSync(outputFilename, JSON.stringify(analysis, null, 2));

    console.log(`\n✅ Analysis Complete! Results saved to ${outputFilename}`);
    console.log("\n--- SNEAK PEEK ---");
    console.log("💡 What Customers Care About:");
    analysis.whatCustomersCareAbout.forEach(c => console.log(`  - ${c.category} (${c.importance}): ${c.description}`));
    console.log("\n👍 Top Praises:");
    analysis.commonPraises.slice(0, 2).forEach(p => console.log(`  - ${p.theme}`));
    console.log("\n👎 Top Complaints:");
    analysis.commonComplaints.slice(0, 2).forEach(c => console.log(`  - ${c.theme}`));
    console.log("------------------\n");

    // Optional: Also ask if user wants to analyze all competitors together
    // For now, let's keep it simple and just do the target product as it perfectly fulfills the request
    
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
  }
}

main();
