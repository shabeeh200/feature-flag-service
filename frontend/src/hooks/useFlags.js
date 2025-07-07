// src/hooks/useFlags.js
import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useFlags = () => {
  const [flags, setFlags]       = useState([]);
  const [current, setCurrent]   = useState(null);  // single-flag state
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // 1) FETCH ALL
  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await api.get('/');
      setFlags(res.data);
    } catch (err) {
      setError(err);

    } finally {
      setLoading(false);
    }
  };

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
    fetchFlags();
  }, []);

  return {
    flags,        // array of all flags
    current,      // last single-flag fetched
    loading,
    error,
    // Methods:
    fetchFlags,
    fetchFlag,
    createFlag,
    updateFlag,
    toggleFlag,
    deleteFlag,
  };
};
