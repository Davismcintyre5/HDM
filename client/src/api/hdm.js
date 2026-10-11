import client from './axios';

const hdmApi = {
  getCompany: () => client.get('/hdm/api/company'),
  getServices: () => client.get('/hdm/api/services'),
  getApps: (params) => client.get('/hdm/api/apps', { params }),
  getFeaturedApps: () => client.get('/hdm/api/apps/featured'),
  getAppCategories: () => client.get('/hdm/api/apps/categories'),
  getAppBySlug: (slug) => client.get(`/hdm/api/apps/${slug}`),
  likeApp: (id) => client.post(`/hdm/api/apps/${id}/like`),
  getProjects: () => client.get('/hdm/api/projects'),
  getFeaturedProjects: () => client.get('/hdm/api/projects/featured'),
  getPhotos: (params) => client.get('/hdm/api/photos', { params }),
  submitContact: (data) => client.post('/hdm/api/contact', data),
  getAiConfig: () => client.get('/hdm/api/ai/config'),
  aiChat: (message) =>
    client.post('/hdm/api/ai/chat', { message }, { timeout: 60000 }),
};

export default hdmApi;