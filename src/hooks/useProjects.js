import { useState, useEffect, useCallback } from 'react';
import { getProjects, getProject, createProject, updateProject, deleteProject, trackProjectClick } from '../services/api';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects(filters);
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(async (projectData) => {
    const data = await createProject(projectData);
    setProjects(prev => [data, ...prev]);
    return data;
  }, []);

  const editProject = useCallback(async (id, updates) => {
    const data = await updateProject(id, updates);
    setProjects(prev => prev.map(p => p.id === id ? data : p));
    return data;
  }, []);

  const removeProject = useCallback(async (id) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const trackClick = useCallback(async (id, type) => {
    await trackProjectClick(id, type);
  }, []);

  return {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    trackClick,
    refetch: fetchProjects,
  };
}

export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { project, loading, error };
}
