const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  analyze: async (url: string) => {
    const res = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to analyze listing');
    }
    return res.json();
  },

  timeline: async (url: string) => {
    const res = await fetch(`${API_URL}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  competitors: async (url: string) => {
    const res = await fetch(`${API_URL}/competitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error('Failed to fetch competitors');
    return res.json();
  },

  chat: async (message: string, url: string) => {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, url }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },
};
