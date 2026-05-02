import { rainforest } from '../providers/rainforest.js';
import { analyzeProductLocally } from '../providers/localAnalysis.js';
import { ai } from '../providers/ai.js';

export const analyzeService = {
  async analyzeListing(url) {
    console.log('🚀 [Analyze] STEP 1: Request received for:', url.slice(0, 80));

    // STEP 2 → 3: Fetch real product data
    const productData = await rainforest.getProductData(url);
    console.log('📦 [Analyze] STEP 3: Product:', productData.title, '| Rating:', productData.rating, '| Reviews:', productData.reviewsCount);

    // STEP 4: Try AI first, fall back to local analysis engine
    let analysis;

    const hasAiKey = !!(process.env.OPENAI_API_KEY);
    if (hasAiKey) {
      try {
        console.log('🤖 [Analyze] STEP 4a: Attempting AI analysis...');

        const systemPrompt = `You are an expert Amazon listing analyst.

Return EXACTLY this JSON structure — no markdown, no explanation:
{
  "overallScore": <integer 0-100>,
  "verdict": "<Strong | Needs Work | Poor>",
  "factors": [
    { "factor": "<name>", "score": <integer 0-10>, "reason": "<brief>" }
  ],
  "painPoints": ["<issue>"],
  "fixes": ["<action>"]
}

Include 4-6 factors covering: Title, Bullet Points, Pricing, Review Sentiment, Images, A+ Content.`;

        const userPrompt = `Title: ${productData.title}
Price: ${productData.price ?? 'N/A'}
Rating: ${productData.rating ?? 'N/A'} stars (${productData.reviewsCount} reviews)
Features:
${(productData.features || []).slice(0, 8).map((f, i) => `${i + 1}. ${typeof f === 'string' ? f : f.text || JSON.stringify(f)}`).join('\n') || 'No features listed'}`;

        analysis = await ai.generateStructuredResponse(systemPrompt, userPrompt);
        console.log('✅ [Analyze] STEP 4a: AI analysis succeeded. Score:', analysis.overallScore);

      } catch (aiErr) {
        console.warn('⚠️ [Analyze] AI failed, using local engine:', aiErr.message);
        analysis = analyzeProductLocally(productData);
      }
    } else {
      console.log('🔧 [Analyze] STEP 4b: Using local analysis engine (no AI key set)');
      analysis = analyzeProductLocally(productData);
    }

    console.log('✅ [Analyze] STEP 5: Done. Score:', analysis.overallScore, '| Verdict:', analysis.verdict);

    return {
      overallScore: analysis.overallScore,
      verdict: analysis.verdict,
      factors: analysis.factors || [],
      painPoints: analysis.painPoints || [],
      fixes: analysis.fixes || [],
      whatsWorking: analysis.whatsWorking || [],
      product: {
        title: productData.title,
        price: productData.price,
        currency: productData.currency || { symbol: '$', code: 'USD' },
        rating: productData.rating,
        reviewsCount: productData.reviewsCount,
        image: productData.image,
        asin: productData.asin,
        bsr: productData.bsr,
        complaints: productData.complaints || [],
        praises: productData.praises || [],
      }
    };
  }
};