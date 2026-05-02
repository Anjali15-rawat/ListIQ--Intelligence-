import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  rainforestKey: process.env.RAINFOREST_API_KEY,
  aiKey: process.env.OPENAI_API_KEY,
};

// Only crash on missing Rainforest key — AI key is validated at call time
if (!config.rainforestKey) {
  console.error('❌ ERROR: Missing required environment variable: RAINFOREST_API_KEY');
  process.exit(1);
}

if (!config.aiKey) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not set — AI analysis will fail');
}

export default config;