import { useState, useEffect } from 'react';

const useRoute = (id: string | string[] | undefined) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoute = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/routes/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch route');
        }
        const routeData = await res.json();
        setData(routeData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  return { data, loading, error };
};

export default useRoute;
