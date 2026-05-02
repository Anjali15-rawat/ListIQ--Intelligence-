import { rainforest } from '../providers/rainforest.js';
import { ai } from '../providers/ai.js';

// ── Intent detection ──────────────────────────────────────────────────────────
function detectIntent(msg) {
  const m = msg.toLowerCase();

  // Greetings
  if (m.match(/^(hi+|hello|hey+|howdy|good\s*(morning|evening|afternoon)|sup|what'?s up)\b/)) return 'greet';
  if (m.match(/how.*(you|kiti)|are you (ok|good|fine|doing)/)) return 'how_are_you';

  // High-specificity intents first (before generic 'what are/what is' can hijack)
  if (m.match(/bsr|best sell.*rank/)) return 'explain_bsr';
  if (m.match(/\ba9\b|algorithm|how.*amazon.*rank/)) return 'explain_algo';
  if (m.match(/vine|early reviewer/)) return 'explain_vine';

  // Complaint/review intent — must match before 'what are' explain catch-all
  if (m.match(/complain|complaint|negative (comment|review|feedback)|what.*buyer|what.*customer|what.*people.*say|buyer.*say|customer.*say|what.*wrong|what.*bad|what.*issue|what.*problem/)) return 'reviews';

  if (m.match(/rating|stars?|\d[\s.]\d\s*star|how (good|bad) (is|are)/)) return 'rating';
  if (m.match(/review|feedback/)) return 'reviews';

  // Pricing — 'advice' and 'strategy' added; checked before ads
  if (m.match(/price|pric(ing|e)|cost|cheap|expensiv|discount|coupon|deal|value for money|worth (it|buying)|afford|pricing advice|pricing strategy/)) return 'price';

  if (m.match(/title|headline|product name|main title/)) return 'title';
  if (m.match(/bullet|feature list|description|specification|spec/)) return 'bullets';
  if (m.match(/image|photo|picture|video|visual|thumbnail|main image/)) return 'images';
  if (m.match(/keyword|seo|search term|rank(ing)?|visibility|index(ed)?|discoverab/)) return 'keywords';
  if (m.match(/competitor|competition|rival|\bvs\b|versus|compare|better than|similar product/)) return 'competitor';
  if (m.match(/\bads?\b|ppc|sponsored|campaign|advertis|cpc|acos|tacos/)) return 'ads';
  if (m.match(/score|overall|audit result|performance|how (am i|is it) doing/)) return 'score';
  if (m.match(/fix|improve|optimis|optimiz|suggest|recommend|what (should|can|do) i|how (to|can i|do i)|action|next step|tip|help me/)) return 'improve';
  if (m.match(/ship|deliver|fulfil|\bfba\b|\bfbm\b|prime badge|logistic/)) return 'shipping';
  if (m.match(/a\+|enhanced content|brand content|storefront|brand store/)) return 'aplus';
  if (m.match(/return|refund|policy|warranty/)) return 'returns';
  if (m.match(/sell|sales|conversion|buy box|buybox|revenue/)) return 'sales';
  if (m.match(/categor|niche|market|segment/)) return 'category';

  // Generic explain — absolute last resort before default
  if (m.match(/what is|what are|explain|tell me (about|more)|how does|why (is|does|do)/)) return 'explain';
  return 'general';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function productCtx(p) {
  if (!p) return null;
  return {
    title:     p.title || 'your product',
    short:     (p.title || 'your product').slice(0, 45),
    rating:    p.rating,
    reviews:   p.reviewsCount,
    price:     p.price,
    curr:      p.currency?.symbol || '₹',
    bsr:       p.bsr,
    features:  (p.features || []).length,
    titleLen:  (p.title || '').length,
    complaints: p.complaints || [],
    praises:    p.praises || [],
  };
}

// ── Response builder ──────────────────────────────────────────────────────────
function respond(intent, msg, p) {
  const ctx = productCtx(p);
  const hasProduct = !!ctx;

  switch (intent) {

    case 'greet':
      if (!hasProduct)
        return `Hey there! 👋 I'm **Kiti**, your Amazon listing co-pilot. Paste any Amazon product URL in the search bar above and hit **Analyze** — I'll audit it and answer your questions with real data!`;
      return `Hey! 👋 I've analyzed **"${ctx.short}…"** — ${ctx.rating}★ at ${ctx.curr}${ctx.price}. What would you like to dig into — ratings, keywords, images, competitors, or something else?`;

    case 'how_are_you':
      return `I'm running perfectly! 🐱✨ ${hasProduct ? `Just finished analyzing "${ctx.short}…" — ready to help. What's on your mind?` : 'Waiting for a product to analyze! Paste an Amazon URL above to get started.'}`;

    case 'rating':
      if (!hasProduct || !ctx.rating)
        return `No product loaded yet — paste an Amazon URL in the search bar and hit Analyze. Then I'll break down exactly what your rating means for conversion! 🔍`;
      if (ctx.rating >= 4.5)
        return `**${ctx.rating}★** out of 5 across **${(ctx.reviews||0).toLocaleString()} reviews** — that's top-tier! 🌟\n\nTo maintain it:\n• Respond to every 1-2★ review within 24 hours\n• Use the "Request a Review" button in Seller Central after every order\n• Fix the root cause of any recurring complaints before they compound`;
      if (ctx.rating >= 4.0)
        return `**${ctx.rating}★** is decent, but crossing **4.3★** is the threshold where Amazon's algorithm starts significantly boosting organic rank.\n\nTo get there:\n• Identify your most common complaint and address it in your bullets\n• A 0.2★ jump can increase conversion by ~8-12%\n• Enroll in Amazon Vine if you have Brand Registry`;
      return `⚠️ **${ctx.rating}★** is below the 4.0 competitive floor — this is actively hurting your click-through and conversion rates.\n\nImmediate actions:\n• Check the real buyer complaints in your Audit → Pain Points section\n• Fix the #1 product or listing issue driving 1-2★ reviews\n• Consider Amazon Vine to dilute negative reviews with quality ones`;

    case 'reviews':
      if (!hasProduct)
        return `Analyze a product first and I'll show you real buyer feedback — including the exact complaint sentences from 1-2★ reviews. 🔍`;
      if (ctx.complaints.length > 0) {
        const topTwo = ctx.complaints.slice(0, 2).map(c => `• *"${c}"*`).join('\n');
        return `Real complaints from buyers of **"${ctx.short}…"**:\n\n${topTwo}\n\n💡 Each complaint is a conversion barrier. Address them directly in your bullet points or description — buyers read the negatives before buying.`;
      }
      if ((ctx.reviews||0) < 50)
        return `Only **${ctx.reviews || 0} reviews** so far — that's too few for meaningful complaint analysis.\n\nTo grow faster:\n• Use the "Request a Review" automation in Seller Central\n• Enroll in Amazon Vine (free for brand-registered sellers with <30 reviews)\n• Target 10+ new reviews/month as a baseline goal`;
      return `Your **${(ctx.reviews||0).toLocaleString()} reviews** are a strong signal! Check the Audit tab Pain Points section — I've extracted the most common complaints from your actual buyer reviews there.`;

    case 'price':
      if (!hasProduct || !ctx.price)
        return `Load a product via the search bar and I'll give you pricing analysis specific to that listing — including how it compares to competitors in the Competitor Spy tab.`;
      return `Your current price is **${ctx.curr}${ctx.price}**.\n\nPricing tactics to test:\n• A 7-day **10% coupon** adds a strikethrough price — boosts CTR by ~12%\n• Check the **Competitor Spy tab** to see if you're priced above or below top rivals\n• If your rating is ${ctx.rating >= 4.3 ? '4.3★+, you can likely price 10-15% higher without losing conversion' : 'below 4.3★, keep price competitive until rating improves'}\n• Use "Subscribe & Save" to increase repeat purchase revenue`;

    case 'title':
      if (!hasProduct)
        return `Analyze a product first — I'll audit the exact title for length, keyword placement, and structure.`;
      const len = ctx.titleLen;
      const titleTip = len < 80
        ? `⚠️ Only **${len} characters** — too short! Amazon allows up to 200. You're missing keyword real estate.\n\nAdd: primary keyword + brand + key specs (size/color/capacity) + use case`
        : len > 200
        ? `⚠️ **${len} characters** — Amazon may truncate. Cut to under 200, keeping primary keyword in the first 5 words.`
        : `✅ Good length (${len} chars). Check that your **primary keyword appears in the first 5 words** — that's where A9 weighs it heaviest.`;
      return `**"${ctx.short}…"**\n\n${titleTip}\n\n**Title formula:** [Primary Keyword] + [Brand] + [Key Spec 1] + [Key Spec 2] + [Use Case/Color/Size]`;

    case 'bullets':
      return `**Bullet point formula that converts:**\n\n• **LEAD WITH BENEFIT** (in caps), then explain the feature behind it\n• Cover: main use case · material/build quality · dimensions · compatibility · warranty\n• Each bullet should pre-answer a buyer objection before they leave the page\n• Use power words: "Effortlessly", "Professional-grade", "Backed by 1-year warranty"\n• Keep each bullet under 200 characters so they render fully on mobile${hasProduct && ctx.features < 5 ? `\n\n⚠️ Your listing has only **${ctx.features} bullets** — aim for 5 to maximize coverage.` : ''}`;

    case 'images':
      return `**7-image strategy (Amazon best practice):**\n\n• 1️⃣ Pure white background main image — mandatory, highest impact\n• 2️⃣ Lifestyle shot — product in real use/environment\n• 3️⃣ Feature infographic with text callouts\n• 4️⃣ Size/scale comparison (next to a hand or known object)\n• 5️⃣ Close-up of key differentiating feature\n• 6️⃣ Packaging + what's in the box\n• 7️⃣ Short **demo video** — adds ~9% average conversion lift\n\n📱 Optimize for mobile: 50%+ of buyers browse on phones — text on images should be readable at 400px.`;

    case 'keywords':
      return `**Keyword placement strategy:**\n\n• **Title** → primary keyword in first 5 words (highest A9 weight)\n• **Bullet headers** → secondary keywords in ALL CAPS\n• **Product description** → long-tail variants, natural sentences\n• **Backend search terms** → fill all 250 bytes, no commas, no repetition\n• **A+ Content alt text** → hidden keyword boost\n\n🔎 Free research: Amazon autocomplete, "Customers also bought", and competitor titles. Tools: Helium 10 Cerebro, Jungle Scout.${hasProduct ? `\n\nFor "${ctx.short}…", check that your top category keyword appears in the first 5 words of your title.` : ''}`;

    case 'competitor':
      return `Check the **Competitor Spy tab** for a live side-by-side! Here's what to look for:\n\n• **Higher reviews?** → You need a review velocity strategy (Vine + Request a Review)\n• **Lower price?** → Add a bundle value-add (free case, extended warranty card, etc.)\n• **Better images?** → Invest in one lifestyle photoshoot — ROI is almost always positive\n• **Longer title?** → You're leaving keyword slots empty\n• **A+ Content?** → Get Brand Registry and build it — it's free and lifts conversion 3-10%`;

    case 'ads':
      return `**PPC quick-start (3 phases):**\n\n• **Phase 1 (Week 1-2):** Auto Sponsored Products campaign at ${hasProduct ? `${ctx.curr}500-1000` : '₹500-1000'}/day — let Amazon find your keywords\n• **Phase 2 (Week 3):** Download Search Term Report → move winners to Manual (Exact match)\n• **Phase 3 (Ongoing):** Negate irrelevant terms in Auto, raise bids on top converters\n\n🎯 Target **TACoS below 15%** for profitability. ACOS alone is misleading — watch organic rank lift from ad-driven sales velocity.`;

    case 'score':
      if (!hasProduct)
        return `Analyze a product first — I'll explain exactly which of the 5 factors (title, rating, reviews, bullets, pricing) is dragging your score down and what to do about each.`;
      return `Your listing is scored on **5 weighted factors**:\n\n• Title optimisation (20%) — keyword placement & length\n• Rating quality (25%) — ${ctx.rating ? `yours: ${ctx.rating}★` : 'run analysis to check'}\n• Review volume (20%) — ${ctx.reviews ? `yours: ${(ctx.reviews).toLocaleString()}` : 'run analysis'}\n• Feature completeness (15%) — ${ctx.features ? `yours: ${ctx.features} bullets` : 'run analysis'}\n• Pricing competitiveness (20%)\n\nCheck the **Score Breakdown** card in the Audit tab for your exact numbers.`;

    case 'improve':
      if (!hasProduct)
        return `Paste an Amazon URL above and click **Analyze** — I'll generate a product-specific action plan ranking improvements by impact. No generic tips, only what matters for your actual listing.`;
      const fixes = [];
      if (ctx.complaints.length > 0) fixes.push(`Fix the #1 buyer complaint: *"${ctx.complaints[0].slice(0,60)}..."* — address it in your bullets`);
      if (ctx.rating < 4.3) fixes.push(`Push rating past 4.3★ — enroll in Amazon Vine or use Request a Review automation`);
      if (ctx.titleLen < 100) fixes.push(`Expand your title to 150+ chars — you're leaving keyword slots empty`);
      if (ctx.features < 5) fixes.push(`Add ${5 - ctx.features} more bullet point(s) — aim for 5 comprehensive bullets`);
      fixes.push(`Add a product demo video — average +9% conversion lift`);
      return `**Top improvement actions for "${ctx.short}…":**\n\n${fixes.slice(0,4).map((f,i) => `${i+1}. ${f}`).join('\n')}\n\nSee the full list with priority levels in your **Recommended Fixes** card in the Audit tab.`;

    case 'shipping':
      return `**FBA vs FBM breakdown:**\n\n• **FBA** (Amazon ships): Prime badge, ~15-25% higher conversion, no customer service headaches — best for items under 5kg with good velocity\n• **FBM** (You ship): More control, lower fees per unit, but no Prime badge\n\n💡 For most sellers, FBA wins on conversion alone. The Prime badge is worth the storage fees unless your margins are extremely thin.`;

    case 'aplus':
      return `**A+ Content guide:**\n\n• Requires **Brand Registry** (free, ~2 weeks to approve)\n• Unlocks: comparison tables, brand story module, enhanced images with hotspots\n• Average conversion lift: **3-10%** — free money, no reason to skip\n• Use comparison charts to cross-sell your catalog\n• **Premium A+** (video, interactive modules) requires 15%+ Brand Content Score`;

    case 'returns':
      return `**Reducing return rate:**\n\n• Match images 100% to the actual product — "not as described" is the #1 return reason\n• Add a **dimensions infographic** — prevents wrong-size returns\n• Respond to return requests within 24h with a solution offer first\n• Add an FAQ section in your description addressing top return triggers\n• If returns persist, check your 1-2★ reviews for the pattern`;

    case 'sales':
      if (!hasProduct)
        return `Analyze a product and I'll give you specific conversion data and sales levers. Generally, every 0.1★ rating improvement = ~1.5% conversion increase.`;
      return `**Sales levers for "${ctx.short}…":**\n\n• **Conversion rate** = Orders ÷ Sessions × 100. Amazon avg: ~12%, aim for 15%+\n• **Buy Box**: competitive price + FBA + healthy account metrics = wins Buy Box\n• **Lightning Deals** during high-traffic events (Prime Day, festivals) spike BSR → organic rank\n• ${ctx.rating >= 4.3 ? 'Your rating is strong — focus on image quality and title to boost CTR' : 'Fix rating first — it\'s your biggest conversion blocker right now'}`;

    case 'explain_bsr':
      return `**BSR (Best Seller Rank)** = Amazon's real-time ranking of sales velocity vs all products in a category.\n\n• BSR #1 = fastest-selling product in category\n• **Lower number = better** (BSR 500 beats BSR 5,000)\n• Changes hourly based on recent sales, so it fluctuates constantly\n• A sudden BSR drop (smaller number) means sales increased — not decreased!\n• Use BSR to benchmark: if top 3 competitors are BSR <1,000, that's your target.`;

    case 'explain_algo':
      return `**Amazon's A9 algorithm** ranks products based on:\n\n• **Relevance** — do your title/bullets/backend keywords match the search query?\n• **Performance** — conversion rate, click-through rate, reviews, pricing\n• **Availability** — in-stock rate (FBA helps significantly)\n\n💡 The #1 lever: improve your **main image CTR** (better thumbnail = more clicks = A9 boost) and **conversion rate** (better bullets + reviews = more buys per visit).`;

    case 'explain_vine':
      return `**Amazon Vine** lets you send free units to top-tier Amazon reviewers in exchange for honest, verified reviews.\n\n• Free for brand-registered sellers with **fewer than 30 existing reviews**\n• Enroll up to **30 units per ASIN**\n• Typically generates 10-20 detailed reviews within 4-6 weeks\n• Reviews can be positive or negative — they're unbiased\n• Best used on new launches to build initial review foundation quickly`;

    case 'explain':
      return `Great question! I specialize in **Amazon listing optimization**. Try asking me something specific like:\n\n• *"How does my rating compare?"*\n• *"What are buyers complaining about?"*\n• *"How do I improve my title?"*\n• *"What keywords should I target?"*\n• *"Explain BSR"* or *"How does the A9 algorithm work?"*`;

    default:
      if (!hasProduct)
        return `Hi! I'm **Kiti** 🐱 Paste an Amazon URL in the search bar above and click **Analyze** — then ask me anything about:\n\n• Rating & reviews analysis\n• Pricing strategy\n• Title & keyword optimization\n• Image best practices\n• PPC advertising\n• Competitor gaps\n\nWhat would you like to know?`;
      return `I'm looking at **"${ctx.short}…"** right now. You can ask me:\n\n• *"What are buyers complaining about?"*\n• *"How do I improve my rating?"*\n• *"Is my price competitive?"*\n• *"What keywords am I missing?"*\n• *"How can I improve conversion?"*`;
  }
}

// ── System prompt builder for AI ──────────────────────────────────────────────
function buildSystemPrompt(p) {
  const curr = p?.currency?.symbol || '₹';
  const productContext = p
    ? `You have analyzed this Amazon product:
Title: ${p.title}
Price: ${curr}${p.price}
Rating: ${p.rating}★ (${(p.reviewsCount||0).toLocaleString()} reviews)
ASIN: ${p.asin || 'N/A'}
BSR: ${p.bsr || 'N/A'}
Bullet points: ${(p.features||[]).length}
Top complaints from buyers: ${(p.complaints||[]).slice(0,2).join(' | ') || 'none extracted'}
Top praises from buyers: ${(p.praises||[]).slice(0,2).join(' | ') || 'none extracted'}`
    : 'No product has been analyzed yet. Encourage the user to paste an Amazon URL and hit Analyze.';

  return `You are Kiti, a friendly expert Amazon listing optimization assistant for ListiQ.

${productContext}

Rules:
- Answer the user's EXACT question using the product data above when possible
- Give specific, actionable advice — not vague generalities
- Be warm and concise (2-5 sentences, or a short list if helpful)
- Use **bold** for key terms and numbers
- Never invent data — if you don't have it, say so and suggest running an analysis
- Focus on Amazon seller optimization (title, images, reviews, keywords, pricing, PPC)`;
}

// ── Main export ───────────────────────────────────────────────────────────────
export const chatService = {
  async handleChat(message, url = null) {
    const resolvedUrl = url?.trim() && url.includes('amazon.') ? url : null;
    let productData = null;

    if (resolvedUrl) {
      try { productData = await rainforest.getProductData(resolvedUrl); }
      catch (_) {}
    }

    const intent = detectIntent(message);
    console.log(`💬 [Chat] Intent="${intent}" | Product=${!!productData} | Msg="${message.slice(0,40)}"`);

    // Try OpenAI for fully dynamic responses
    if (process.env.OPENAI_API_KEY) {
      try {
        const reply = await ai.chatCompletion(
          buildSystemPrompt(productData),
          [{ role: 'user', content: message }]
        );
        return reply;
      } catch (err) {
        console.warn(`⚠️ [Chat] AI failed (${err.message}), using local engine`);
      }
    }

    // Rich local engine — intent-aware, product-contextual
    return respond(intent, message, productData);
  }
};
