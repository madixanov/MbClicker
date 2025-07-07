import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const useBonuses = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bonuses`, {
          params: {
            sort: "createdAt:desc",
            fields: ["Name", "Prize", "Completed", "documentId"],
          },
        });

        console.log("Бонусы получены:", response.data);
        setBonuses(response.data?.data || []);
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
