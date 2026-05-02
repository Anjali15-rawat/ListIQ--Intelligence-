function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function scoreRating(rating) {
  if (!rating) return 5;
  if (rating >= 4.5) return 10;
  if (rating >= 4.0) return 8;
  if (rating >= 3.5) return 6;
  if (rating >= 3.0) return 4;
  return 2;
}

function scoreReviews(count) {
  if (!count) return 3;
  if (count >= 5000) return 10;
  if (count >= 1000) return 8;
  if (count >= 500)  return 7;
  if (count >= 100)  return 5;
  if (count >= 10)   return 3;
  return 1;
}

function scoreTitle(title) {
  if (!title) return 4;
  const len = title.length;
  const hasBenefit = /\b(premium|pack|set|kit|bundle|pro|plus|ultra|series|edition|heavy|duty|waterproof|wireless|fast|quick|original|genuine)\b/i.test(title);
  const hasNumbers = /\d/.test(title);
  let score = 5;
  if (len >= 80 && len <= 200) score += 2;
  else if (len < 40) score -= 2;
  if (hasBenefit) score += 1;
  if (hasNumbers) score += 1;
  return clamp(score, 1, 10);
}

function scoreFeatures(features) {
  if (!features || features.length === 0) return 2;
  if (features.length >= 7) return 9;
  if (features.length >= 5) return 7;
  if (features.length >= 3) return 5;
  return 3;
}

function scorePricing(price) {
  if (!price) return 5;
  const p = parseFloat(price);
  if (isNaN(p)) return 5;
  if (p >= 10 && p <= 50) return 9;
  if (p >= 5  && p <= 100) return 7;
  if (p > 100 && p <= 300) return 6;
  if (p > 300) return 5;
  return 4;
}

function generateWhatsWorking(productData, ratingScore, reviewScore, titleScore) {
  const working = [];

  // ✅ Real positive customer quotes FIRST
  if (productData.praises && productData.praises.length > 0) {
    for (const praise of productData.praises.slice(0, 3)) {
      working.push(`"${praise}"`);
    }
  }

  // Then data-driven positives (only if no real praises fill the slots)
  if (working.length < 2) {
    if (ratingScore >= 8) working.push(`Strong ${productData.rating}★ rating builds buyer confidence and improves search ranking`);
    if (reviewScore >= 7) working.push(`${(productData.reviewsCount || 0).toLocaleString()} reviews provides strong social proof`);
    if (titleScore >= 8) working.push('Title is well-optimised with keywords and product specifications');
    if ((productData.features || []).length >= 5) working.push('Comprehensive bullet points cover key benefits and objections');
    if (productData.bsr) working.push(`Ranked ${productData.bsr} — active category presence confirmed`);
  }

  if (working.length === 0) working.push('Listing is indexed and discoverable on Amazon search');
  return working.slice(0, 4);
}

function generatePainPoints(productData, titleScore, ratingScore, featureScore) {
  const points = [];

  // ✅ Real negative customer quotes FIRST — these are verbatim complaints
  if (productData.complaints && productData.complaints.length > 0) {
    for (const complaint of productData.complaints.slice(0, 4)) {
      points.push({ type: 'review', text: `"${complaint}"` });
    }
  }

  // Data-driven issues (only when not already dominated by real complaints)
  if (points.length < 3) {
    if (!productData.title || productData.title.length < 60) {
      points.push({ type: 'data', text: 'Title is too short — missing important keywords that buyers search for' });
    }
    if (ratingScore < 7 && productData.rating) {
      points.push({ type: 'data', text: `Rating of ${productData.rating}★ is below the 4.0 competitive threshold — hurting conversion` });
    }
    if ((productData.reviewsCount || 0) < 100) {
      points.push({ type: 'data', text: `Low review count (${productData.reviewsCount || 0}) reduces buyer trust and organic ranking` });
    }
    if (featureScore < 6) {
      points.push({ type: 'data', text: 'Incomplete bullet points — not enough features to overcome buyer hesitation' });
    }
  }

  return points.slice(0, 5);
}

function generateFixes(productData, titleScore, featureScore, ratingScore) {
  const fixes = [];
  if (titleScore < 8) fixes.push('Rewrite title: start with primary keyword, add size/quantity/model, target 150-200 characters');
  if (featureScore < 7) fixes.push('Expand to 7 bullet points — lead each with the customer benefit (not the feature name)');
  if (ratingScore < 8) fixes.push('Set up automated post-purchase email sequence requesting honest reviews from happy buyers');
  if ((productData.reviewsCount || 0) < 500) fixes.push('Enroll in Amazon Vine or Early Reviewer Program to build review velocity');
  if (productData.complaints && productData.complaints.length > 0) {
    fixes.push('Address top customer complaints directly in bullet points and FAQ section');
  }
  fixes.push('Add 3D lifestyle images showing product in real-world use — target 7+ images total');
  fixes.push('Run Sponsored Product ads targeting the top 3 competitor ASINs to capture their buyers');
  return fixes.slice(0, 5);
}

export function analyzeProductLocally(productData) {
  const titleScore   = scoreTitle(productData.title);
  const ratingScore  = scoreRating(productData.rating);
  const reviewScore  = scoreReviews(productData.reviewsCount);
  const featureScore = scoreFeatures(productData.features);
  const pricingScore = scorePricing(productData.price);

  // Weighted overall score
  const overallScore = clamp(Math.round(
    (titleScore   * 0.20 +
     ratingScore  * 0.30 +
     reviewScore  * 0.20 +
     featureScore * 0.15 +
     pricingScore * 0.15) * 10
  ), 10, 98);

  const verdict =
    overallScore >= 75 ? 'Strong' :
    overallScore >= 50 ? 'Needs Work' : 'Poor';

  const factors = [
    {
      factor: 'Title Optimization',
      score: titleScore,
      reason: titleScore >= 8 ? 'Title is well-structured with keywords' : titleScore >= 6 ? 'Title has room for more keywords' : 'Title is too short or missing key search terms'
    },
    {
      factor: 'Rating & Sentiment',
      score: ratingScore,
      reason: ratingScore >= 8 ? `Strong ${productData.rating}★ rating builds buyer confidence` : ratingScore >= 6 ? `Decent ${productData.rating}★ but below top-performing threshold` : `${productData.rating}★ rating is a conversion barrier`
    },
    {
      factor: 'Review Volume',
      score: reviewScore,
      reason: reviewScore >= 8 ? `${productData.reviewsCount?.toLocaleString()} reviews provides strong social proof` : reviewScore >= 5 ? `${productData.reviewsCount} reviews needs more velocity` : 'Very few reviews — buyers may question legitimacy'
    },
    {
      factor: 'Feature Bullets',
      score: featureScore,
      reason: featureScore >= 8 ? 'Good bullet points covering key benefits' : featureScore >= 5 ? 'Bullets present but not covering all objections' : 'Missing/sparse bullets — major conversion gap'
    },
    {
      factor: 'Pricing',
      score: pricingScore,
      reason: pricingScore >= 8 ? 'Price point is competitive for this category' : pricingScore >= 6 ? 'Price acceptable but worth A/B testing' : 'Price may be deterring impulse buyers'
    },
  ];

  const whatsWorking = generateWhatsWorking(productData, ratingScore, reviewScore, titleScore);
  const painPoints   = generatePainPoints(productData, titleScore, ratingScore, featureScore);
  const fixes        = generateFixes(productData, titleScore, featureScore, ratingScore);

  return { overallScore, verdict, factors, painPoints, fixes, whatsWorking };
}
