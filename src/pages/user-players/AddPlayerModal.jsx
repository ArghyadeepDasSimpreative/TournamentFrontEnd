import { useState } from "react";
import { axiosPrivate } from "../../services/config";
import Button from "../../components/button";
import Input from "../../components/input";
import CustomSelect from "../../components/select";

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

export default function AddPlayerModal({ name, userId, tournamentId, onClose, cb }) {
  const [playerName, setPlayerName] = useState("");
  const [position, setPosition] = useState(null);
  const [price, setPrice] = useState("");
  const [overall, setOverall] = useState(""); // New field for overall rating
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddPlayer = async () => {
    if (!playerName || !position || !price || !overall) {
      setError("All fields are required!");
      return;
    }

    if (overall < 1 || overall > 100) {
      setError("Overall rating must be between 1 and 100.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosPrivate.post(`/player/${tournamentId}/${userId}`, {
        name: playerName,
        position: position.value,
        price: Number(price),
        overall: Number(overall), // Include overall in request
        ownerId: userId,
      });

      cb(); // Refresh data
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="w-full text-start font-semibold text-xl mb-4">
        Adding player for {name}
      </header>

      <div className="space-y-4">
        {/* Player Name Input */}
        <Input
          label="Player Name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
        />

        {/* Position Select Dropdown */}
        <CustomSelect
          label="Select Position"
          data={positions}
          config={{ key: "value", label: "label" }}
          onSelect={setPosition}
        />

        {/* Price Input */}
        <Input
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
        />

        {/* Overall Rating Input */}
        <Input
          label="Overall Rating"
          type="number"
          value={overall}
          onChange={(e) => setOverall(e.target.value)}
          placeholder="Enter overall rating (1-100)"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-md font-medium">{error}</p>}

        {/* Submit Button */}
        <Button type="primary" onClick={handleAddPlayer} disabled={loading}>
          {loading ? "Adding..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
