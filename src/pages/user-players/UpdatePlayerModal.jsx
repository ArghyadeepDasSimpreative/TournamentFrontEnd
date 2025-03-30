import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import Button from "../../components/button";
import CustomSelect from "../../components/select";
import Input from "../../components/input"; // Assuming you have an Input component

const positions = [
  { label: "Goalkeeper", value: "GK" },
  { label: "Left Back", value: "LB" },
  { label: "Center Back", value: "CB" },
  { label: "Right Back", value: "RB" },
  { label: "Left Wing Back", value: "LWB" },
  { label: "Right Wing Back", value: "RWB" },
  { label: "Center Midfielder", value: "CM" },
  { label: "Defensive Midfielder", value: "CDM" },
  { label: "Attacking Midfielder", value: "CAM" },
  { label: "Left Midfielder", value: "LM" },
  { label: "Right Midfielder", value: "RM" },
  { label: "Left Winger", value: "LW" },
  { label: "Right Winger", value: "RW" },
  { label: "Striker", value: "ST" },
  { label: "Center Forward", value: "CF" },
];

export default function UpdatePlayerModal({ cb, playerId, userId, tournamentId }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch player details
  useEffect(() => {
    async function fetchPlayer() {
      setFetching(true);
      try {
        let response = await axiosPrivate.get(`/player/${tournamentId}/${userId}/${playerId}`);
        setPlayer(response.data);
      } catch (err) {
        console.error("Error fetching player details:", err);
        setError("Failed to fetch player details.");
      } finally {
        setFetching(false);
      }
    }
    fetchPlayer();
  }, [playerId]);

  // Handle update
  async function handleUpdate() {
    if (!player) return;
    console.log("playerrr ", player)
    if (!player.name || !player.position || player.price == null || !player.overall) {
      setError("All fields are required!");
      return;
    }
    if (player.overall < 1 || player.overall > 100) {
      setError("Overall rating must be between 1 and 100.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.put(`/player/${tournamentId}/${userId}/${playerId}/update`, {
        name: player.name,
        position: player.position,
        price: Number(player.price),
        overall: Number(player.overall),
      });
      cb(); // Refresh data after update
    } catch (err) {
      console.error("Error updating player:", err);
      setError("Failed to update player.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 h-[480px]">
      <h2 className="text-lg font-semibold mb-3">Update Player</h2>

      {fetching ? (
        <p className="text-center text-gray-600">Fetching player details...</p>
      ) : player ? (
        <div className="space-y-3">
          <Input
            label="Name"
            value={player.name}
            onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          />

          {/* Position Select Dropdown */}
          <CustomSelect
            label="Select Position"
            data={positions}
            config={{ key: "value", label: "label" }}
            onSelect={(selected) => setPlayer({ ...player, position: selected.value })}
          />

          <Input
            label="Price"
            type="number"
            value={player.price}
            onChange={(e) => setPlayer({ ...player, price: Number(e.target.value) })}
          />

          {/* Overall Rating */}
          <Input
            label="Overall Rating"
            type="number"
            value={player.overall}
            onChange={(e) => setPlayer({ ...player, overall: Number(e.target.value) })}
            placeholder="Enter overall rating (1-100)"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <Button type="primary" onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No player found.</p>
      )}
    </div>
  );
}
