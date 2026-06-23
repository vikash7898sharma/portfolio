import api from './api';

export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const trackClick = (id, type) => api.post(`/projects/${id}/click/${type}`);
export const uploadScreenshots = (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('screenshots', file));
  return api.post(`/projects/${id}/screenshots`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
