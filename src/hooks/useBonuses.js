import { useEffect, useState } from "react";
import axios from "axios";

const useBonuses = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.get("https://mbclickerstrapi.onrender.com/api/bonuses", {
          params: {
            sort: "createdAt:desc",
            fields: ["Name", "Prize", "Completed", "documentId"], // 👈 добавили нужные поля
          },
        });

        console.log("Бонусы получены:", response.data);

        const raw = response.data?.data || [];

        const mapped = raw.map((item) => ({
          id: item.id,
          ...item.attributes, // если fields указаны — attributes будет содержать только нужное
        }));

        setBonuses(mapped);
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
