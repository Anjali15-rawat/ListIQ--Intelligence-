import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  rainforestKey: process.env.RAINFOREST_API_KEY,
  aiKey: process.env.OPENAI_API_KEY,
};

// Only warn on missing Rainforest key — the app will fall back to smart mock data
if (!config.rainforestKey) {
  console.warn('⚠️ WARNING: RAINFOREST_API_KEY not set — live data fetching will fall back to smart mock profiles');
}

if (!config.aiKey) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not set — AI analysis will fail');
}

export default config;