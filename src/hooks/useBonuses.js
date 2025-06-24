// hooks/useBonuses.js
import { useEffect, useState } from "react";
import axios from "axios";

const useBonuses = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.get("/api/bonuses");
        setBonuses(response.data); // если Strapi настроен без wrapper-а
      } catch (err) {
        console.error("Ошибка при получении бонусов:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBonuses();
  }, []);

  return { bonuses, loading, error };
};

export default useBonuses;
