import { useState, useEffect, useCallback } from 'react';
import { getAnalytics, trackAnalytics } from '../services/api';

export function useAnalytics() {
  const [data, setData] = useState({ events: [], projects: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const track = useCallback(async (event, projectId = null) => {
    try {
      await trackAnalytics(event, projectId);
    } catch (err) {
      // Silently fail tracking
    }
  }, []);

  return {
    events: data.events,
    projects: data.projects,
    stats: data.stats,
    loading,
    error,
    track,
    refetch: fetchAnalytics,
  };
}
