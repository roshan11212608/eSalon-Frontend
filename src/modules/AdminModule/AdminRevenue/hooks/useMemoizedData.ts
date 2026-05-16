import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMemoizedDataOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  enabled?: boolean;
}

interface MemoizedData<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function useMemoizedData<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000, // 5 minutes default
  enabled = true,
}: UseMemoizedDataOptions<T>): MemoizedData<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    // Check cache first
    const cached = cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < cached.ttl) {
      setData(cached.data);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: now,
        ttl,
      });
      
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl, enabled]);

  const refetch = useCallback(async () => {
    // Invalidate cache for this key
    cache.delete(key);
    await fetchData();
  }, [key, fetchData]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}

// Clear all cache or specific keys
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Get cache size (for debugging)
export function getCacheSize(): number {
  return cache.size;
}
