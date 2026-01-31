import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 简单的请求 Hook
 * @param {Function} apiFn - 返回 Promise 的函数
 * @param {Array} deps - 依赖数组
 * @param {Object} options - { manual: boolean }
 */
export default function useRequest(apiFn, deps = [], options = {}) {
  const { manual = false } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback((...args) => {
    setLoading(true);
    setError(null);
    return apiFn(...args)
      .then((res) => {
        if (mountedRef.current) setData(res);
        return res;
      })
      .catch((e) => {
        if (mountedRef.current) setError(e);
        return Promise.reject(e);
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  deps);

  useEffect(() => {
    mountedRef.current = true;
    if (!manual) run();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, run };
}
