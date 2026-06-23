import api from './api';

export const getAnalytics = () => api.get('/analytics');
export const trackEvent = (portfolioId, event, projectId = null) =>
  api.post('/analytics/track', { portfolioId, event, projectId });
