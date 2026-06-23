import { useState, useEffect, useCallback } from 'react';
import { getPortfolio, upsertPortfolio } from '../services/api';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const updatePortfolio = useCallback(async (updates) => {
    try {
      const data = await upsertPortfolio(updates);
      setPortfolio(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { portfolio, loading, error, updatePortfolio, refetch: fetchPortfolio };
}
