export const mockAudit = {
  product: {
    title: "Premium Bamboo Cutting Board Set with Juice Groove (3-Piece)",
    asin: "B0CXY12345",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    price: "$34.99",
    rating: 4.3,
    reviews: 2847,
    bsr: "#142 in Kitchen",
  },
  overallScore: 78,
  verdict: "Strong listing — 3 quick wins available",
  factors: [
    { label: "Title optimization", value: 82 },
    { label: "Bullet points", value: 71 },
    { label: "Image quality", value: 88 },
    { label: "A+ content", value: 54 },
    { label: "Review sentiment", value: 76 },
    { label: "Pricing", value: 85 },
  ],
  painPoints: [
    { text: "12% of reviews mention warping after dishwasher use", severity: "high" as const },
    { text: "Customers expect oil included — not in package", severity: "medium" as const },
    { text: "Smallest board feels too thin per 8% of reviewers", severity: "medium" as const },
  ],
  whatsWorking: [
    "Juice groove highlighted heavily — drives 34% of positive mentions",
    "Gift packaging praised in 18% of 5-star reviews",
    "Eco-friendly bamboo angle resonates with target audience",
  ],
  fixes: [
    { priority: "high" as const, title: "Add 'hand-wash only' to bullet #1 and main image overlay", impact: "+8 score" },
    { priority: "high" as const, title: "Bundle a small bottle of mineral oil — match top competitor", impact: "+6 score" },
    { priority: "medium" as const, title: "Rewrite bullet #3 to lead with thickness specs", impact: "+4 score" },
    { priority: "low" as const, title: "Add lifestyle image with cheese & charcuterie board context", impact: "+2 score" },
  ],
};

export const mockTimeMachine = {
  sentimentTrend: [
    { month: "Jun", positive: 78, negative: 14 },
    { month: "Jul", positive: 80, negative: 12 },
    { month: "Aug", positive: 76, negative: 18 },
    { month: "Sep", positive: 72, negative: 22 },
    { month: "Oct", positive: 68, negative: 26 },
    { month: "Nov", positive: 71, negative: 23 },
    { month: "Dec", positive: 74, negative: 20 },
  ],
  emergingIssues: [
    { issue: "Warping after dishwasher", trend: "+340%", severity: "high" as const },
    { issue: "Small board too thin", trend: "+120%", severity: "medium" as const },
    { issue: "Packaging damage", trend: "+45%", severity: "low" as const },
  ],
  summary: "Negative sentiment spiked in Sept-Oct around durability concerns. Likely tied to a packaging change — investigate supplier batch.",
  suggested: [
    "Update FAQ to clarify hand-wash care",
    "Add reinforced corners on smallest board (next batch)",
    "Respond to last 30 days of 1-star reviews proactively",
  ],
};

export const mockCompetitors = [
  {
    name: "BambooMax Pro Set",
    price: "$29.99",
    score: 84,
    rating: 4.5,
    reviews: 5120,
    strengths: ["Lower price point", "Includes mineral oil", "Lifetime warranty"],
    weaknesses: ["No juice groove on small board", "Plain packaging"],
  },
  {
    name: "GreenLeaf Cutting Trio",
    price: "$39.99",
    score: 72,
    rating: 4.2,
    reviews: 1890,
    strengths: ["Premium gift box", "Thicker boards (1.5cm)"],
    weaknesses: ["Higher price", "No A+ content", "Slow shipping mentions"],
  },
  {
    name: "ChefChoice Bamboo 3-Pack",
    price: "$32.50",
    score: 79,
    rating: 4.4,
    reviews: 3402,
    strengths: ["Strong A+ content", "Great lifestyle photos"],
    weaknesses: ["No juice groove", "Mixed reviews on smell"],
  },
];

export interface MockStat { value: string; label: string; }
export const mockStats: MockStat[] = [
  { value: "12s", label: "Avg analysis" },
  { value: "47", label: "Score factors" },
  { value: "2.1M", label: "Listings audited" },
  { value: "94%", label: "Accuracy" },
];