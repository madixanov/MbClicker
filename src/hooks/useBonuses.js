import { useEffect, useState } from "react";
import usePlayerData from "./usePlayerData";
import { fetchBonusesByPlayer } from "../services/bonusService";

const useBonuses = () => {
  const { player } = usePlayerData();
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBonuses = async () => {
      if (!player?.documentId) return;

      setLoading(true);
      const data = await fetchBonusesByPlayer(player.documentId);
      setBonuses(data);
      setLoading(false);
    };

    loadBonuses();
  }, [player?.documentId]);

  return { bonuses, loading };
};

export default useBonuses;
