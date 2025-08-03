import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useFlags = () => {
  const [flags, setFlags] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);

  // 1) FETCH ALL
    const fetchFlags = useCallback(async (pageArg = page, limit = 10) => {
    setLoading(true);
    try {
      const res = await api.get(`/?page=${pageArg}&limit=${limit}`);
      setFlags(res.data.flags);
      setTotal(res.data.total);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
   }, [page]);

  // 2) FETCH ONE
  const fetchFlag = async (id) => {
  setLoading(true);
  try {
    const res = await api.get(`/${id}`);
    setCurrent(res.data);
    return res.data;
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};


  // 3) CREATE
  const createFlag = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/', data);
      await fetchFlags();
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

const updateFlag = async (id, updates) => {
  setLoading(true);
  try {
    const res = await api.put(`/${id}`, updates);
    await fetchFlags();
    return res.data;
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};

const toggleFlag = async (id) => {
  setLoading(true);
  try {
    const res = await api.patch(`/${id}/toggle`);
    await fetchFlags();
    return res.data;
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};

const deleteFlag = async (id) => {
  setLoading(true);
  try {
    await api.delete(`/${id}`);
    await fetchFlags();
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};


  // On mount, load all flags
useEffect(() => {
  fetchFlags(); // load first page by default
},  [fetchFlags]);

return {
  flags,
  total,
  page,
  totalPages,
  loading,
  error,
  setPage,
  current,
  fetchFlag,
  createFlag,
  updateFlag,
  toggleFlag,
  deleteFlag,
   fetchFlags,
};
};
