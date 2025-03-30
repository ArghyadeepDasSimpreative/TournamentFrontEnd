import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import CustomSelect from "../../components/select";
import Button from "../../components/button";

export default function AddMatch({ tournamentId, cb, teams }) {

  const [homeTeam, setHomeTeam] = useState(teams);
  const [awayTeam, setAwayTeam] = useState(teams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tournament participants
//   useEffect(() => {
   
//     fetchTeams();
//   }, [tournamentId]);

  // Handle match creation
  const handleAddMatch = async () => {
    if (!homeTeam || !awayTeam) {
      setError("Both teams must be selected.");
      return;
    }

    if (homeTeam.value === awayTeam.value) {
      setError("Home team and away team cannot be the same.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosPrivate.post(`/match/${tournamentId}`, {
        homeTeamId: homeTeam.value,
        awayTeamId: awayTeam.value,
      });
      cb(); // Refresh data after adding match
    } catch (err) {
      setError(err.response.data.message);
      console.error("Error adding match:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Add New Match</h2>

      <div className="space-y-4">
        {/* Home Team Select */}
        <CustomSelect
          label="Select Home Team"
          data={teams}
          config={{ key: "_id", label: "teamName" }}
          onSelect={setHomeTeam}
        />

        {/* Away Team Select */}
        <CustomSelect
          label="Select Away Team"
          data={teams}
          config={{ key: "_id", label: "teamName" }}
          onSelect={setAwayTeam}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <Button type="primary" onClick={handleAddMatch} disabled={loading}>
          {loading ? "Adding..." : "Add Match"}
        </Button>
      </div>
    </div>
  );
}
