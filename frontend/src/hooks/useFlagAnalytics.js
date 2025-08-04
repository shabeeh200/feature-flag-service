// hooks/useFlagAnalytics.js
import { useEffect, useState } from "react";
import api from "../api/axios";

const useFlagAnalytics = () => {
  const [data, setData] = useState({
    totalFlags: 0,
    enabledCount: 0,
    disabledCount: 0,
    byEnv: {},
    rolloutBuckets: [],
    newThisWeek: 0,
    evalsThisWeek: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/flag/stats");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching flag analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading };
};

export default useFlagAnalytics;
