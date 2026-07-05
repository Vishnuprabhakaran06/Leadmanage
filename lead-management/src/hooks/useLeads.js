import { useState, useEffect, useCallback, useRef } from 'react';
import { getLeads } from '../api/leadService';
import { useDebounce } from './useDebounce';

const DEFAULT_FILTERS = { status: '', assigned: '', from: '', to: '' };
const DEFAULT_PAGE_SIZE = 10;

export function useLeads() {
  const [leads, setLeads]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState(DEFAULT_FILTERS);
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 300);

  // Track mounted state to avoid state updates after unmount
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const fetchLeads = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLeads(params);
      if (mounted.current) {
        setLeads(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err?.message || 'Failed to load leads.');
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads({
      search: debouncedSearch,
      ...filters,
      page,
      pageSize,
    });
  }, [debouncedSearch, filters, page, pageSize, fetchLeads]);

  const refetch = useCallback(() => {
    fetchLeads({
      search: debouncedSearch,
      ...filters,
      page,
      pageSize,
    });
  }, [debouncedSearch, filters, page, pageSize, fetchLeads]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Reset to page 1 whenever search / filters / pageSize change
  const handleSetSearch = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleSetFilters = useCallback((val) => {
    setFilters((prev) => (typeof val === 'function' ? val(prev) : { ...prev, ...val }));
    setPage(1);
  }, []);

  const handleSetPageSize = useCallback((val) => {
    setPageSize(Number(val));
    setPage(1);
  }, []);

  return {
    leads,
    total,
    loading,
    error,
    search,
    filters,
    page,
    pageSize,
    setSearch: handleSetSearch,
    setFilters: handleSetFilters,
    setPage,
    setPageSize: handleSetPageSize,
    resetFilters,
    refetch,
  };
}
