import api from './api';

export const getMyPortfolio = () => api.get('/portfolio/my');
export const getPortfolioBySlug = (slug) => api.get(`/portfolio/${slug}`);
export const createPortfolio = (data) => api.post('/portfolio', data);
export const updatePortfolio = (id, data) => api.put(`/portfolio/${id}`, data);
export const getPortfolioProjects = (portfolioId) => api.get(`/portfolio/${portfolioId}/projects`);
export const getPortfolioExperiences = (portfolioId) => api.get(`/portfolio/${portfolioId}/experiences`);
