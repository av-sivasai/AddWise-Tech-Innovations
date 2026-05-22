export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://addwise-tech-innovations.onrender.com/api';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not defined. Falling back to:', API_BASE_URL);
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = { success: false, message: text || 'Server returned non-JSON response' };
  }
  return { response, data };
}
