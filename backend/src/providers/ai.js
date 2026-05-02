export const ai = {
  // Used for structured product analysis — expects JSON with overallScore etc.
  async generateStructuredResponse(systemPrompt, userPrompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set in .env');

    console.log('🤖 [AI] Calling OpenAI gpt-4o-mini (structured)...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt + '\n\nCRITICAL: Return ONLY valid JSON. No explanation. No markdown. No extra text.' },
          { role: 'user',   content: userPrompt }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(`OpenAI error: ${data.error?.message || response.statusText}`);
    }

    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText?.trim()) throw new Error('OpenAI returned empty response');

    let parsed;
    try { parsed = JSON.parse(rawText.trim()); }
    catch (_) {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('OpenAI response contained no JSON');
      parsed = JSON.parse(match[0]);
    }
    if (typeof parsed.overallScore !== 'number') throw new Error('OpenAI response missing overallScore');
    return parsed;
  },

  // Used for Kiti chat — returns a plain conversational string
  async chatCompletion(systemPrompt, messages) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set in .env');

    console.log('💬 [AI] Calling OpenAI gpt-4o-mini (chat)...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 350,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(`OpenAI error: ${data.error?.message || response.statusText}`);
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('OpenAI returned empty chat response');
    console.log('💬 [AI] Chat reply:', text.slice(0, 120));
    return text;
  }
};