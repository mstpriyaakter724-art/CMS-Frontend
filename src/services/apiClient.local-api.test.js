import { describe, expect, it } from 'vitest';
import axios from 'axios';

describe('local Laravel API configuration', () => {
  it('reaches the configured auth user endpoint', async () => {
    const baseUrl = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const response = await axios.get(`${baseUrl.replace(/\/$/, '')}/auth/user`, {
      validateStatus: (status) => status === 200 || status === 401,
      headers: { Accept: 'application/json' },
    });

    expect([200, 401]).toContain(response.status);
  });
});
