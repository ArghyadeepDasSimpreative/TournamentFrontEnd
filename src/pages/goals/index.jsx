import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import CustomSelect from "../../components/select";
import TableComponent from "../../components/Table";

const GoalsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [scorersLoading, setScorersLoading] = useState(false);

  async function fetchTournaments() {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("/tournament");
      setTournaments(response.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTopScorers(tournamentId) {
    try {
      setScorersLoading(true);
      const response = await axiosPrivate.get(`/stat/${tournamentId}/top-scorers`);
      console.log("Top Scorers Response:", response.data);
      setTopScorers(response.data);
    } catch (error) {
      console.error("Error fetching top scorers:", error);
    } finally {
      setScorersLoading(false);
    }
  }

  useEffect(() => {
    fetchTournaments();
  }, []);

  function handleTournamentSelect(option) {
    setSelectedTournament(option);
    if (option?.value) {
      fetchTopScorers(option.value);
    } else {
      setTopScorers([]);
    }
  }

  // Updated columns format for the new TableComponent
  const columns = [
    { key: "playerName", label: "Player Name" },
    { key: "teamName", label: "Team Name" },
    { key: "totalGoals", label: "Total Goals" },
  ];

  return (
    <div className="w-full flex flex-col justify-between">
      {loading ? (
        <p>...loading tournaments</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <CustomSelect
              label="Select Tournament"
              data={tournaments.map((t) => ({ label: t.name, value: t._id }))}
              config={{ key: "value", label: "label" }}
              onSelect={handleTournamentSelect}
            />
          </div>

          {scorersLoading ? (
            <p>...loading top scorers</p>
          ) : topScorers.length > 0 ? (
            <TableComponent columns={columns} data={topScorers} />
          ) : (
            selectedTournament && <p>No scorers found for this tournament.</p>
          )}
        </>
      )}
    </div>
  );
};

export default GoalsPage;
