import client from './axios';

const smartgenApi = {
  getSite: () => client.get('/smartgen/api/site'),

  register: (data) => client.post('/smartgen/api/auth/register', data),
  login: (data) => client.post('/smartgen/api/auth/login', data),
  verifyEmail: (token) =>
    client.get('/smartgen/api/auth/verify', { params: { token } }),
  forgotPassword: (email) =>
    client.post('/smartgen/api/auth/forgot-password', { email }),
  resetPassword: (data) =>
    client.post('/smartgen/api/auth/reset-password', data),

  getMe: () => client.get('/smartgen/api/auth/me'),
  resendVerification: () =>
    client.post('/smartgen/api/auth/resend-verification'),

  getDocuments: () => client.get('/smartgen/api/documents'),
  getDocument: (id) => client.get(`/smartgen/api/documents/${id}`),
  createDocument: (data) => client.post('/smartgen/api/documents', data),
  updateDocument: (id, data) =>
    client.put(`/smartgen/api/documents/${id}`, data),
  deleteDocument: (id) => client.delete(`/smartgen/api/documents/${id}`),

  updateProfile: (data) => client.put('/smartgen/api/users/profile', data),
  changePassword: (data) => client.put('/smartgen/api/users/password', data),

  aiChat: (message) =>
    client.post('/smartgen/api/ai/chat', { message }, { timeout: 60000 }),
};

export default smartgenApi;