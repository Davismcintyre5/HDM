const TOKEN_KEY = 'smartgen_token';
const THEME_KEY = 'theme';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  hasToken: () => !!localStorage.getItem(TOKEN_KEY),

  getTheme: () => localStorage.getItem(THEME_KEY) || 'light',
  setTheme: (t) => localStorage.setItem(THEME_KEY, t),
};