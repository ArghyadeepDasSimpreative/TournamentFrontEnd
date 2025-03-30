import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import CustomSelect from "../../components/select"
import TableComponent from "../../components/Table";
import ImageComponent from "../../components/image";
import { Link } from "react-router-dom";

const TeamStatsPage = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teamStandings, setTeamStandings] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [loadingStandings, setLoadingStandings] = useState(false);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axiosPrivate.get("/tournament");
                console.log("response is s", response)
                setTournaments(response.data);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoadingTournaments(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleTournamentSelect = (selected) => {
        setSelectedTournament(selected.value);
        fetchTeamStandings(selected.value);
    };

    const fetchTeamStandings = async (tournamentId) => {
        setLoadingStandings(true);
        try {
            const response = await axiosPrivate.get(`/stat/${tournamentId}/team-standings`);
            setTeamStandings(response.data);
        } catch (error) {
            console.error("Error fetching team standings:", error);
        } finally {
            setLoadingStandings(false);
        }
    };

    const columns = [
        { key: "serial", label: "#" },
        { key: "teamImage", label: "Team", render: (row) => <ImageComponent src={row.teamImage} alt={row.teamName} className="w-10 h-10" type="server"/> },
        { key: "teamName", label: "Team Name", render: (row) => <Link to={`/stats/${selectedTournament}/${row.teamId}`} className="text-sm font-semibold">{row.teamName}</Link> },
        { key: "ownerName", label: "Owner" },
        { key: "totalMatchesPlayed", label: "Matches" },
        { key: "won", label: "Won" },
        { key: "lost", label: "Lost" },
        { key: "draw", label: "Draw" },
        { key: "points", label: "Points" },
        { key: "goalsScored", label: "GS" },
        { key: "goalsConceded", label: "GC" },
        { key: "goalDifference", label: "GD" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Standings</h2>

            {loadingTournaments ? (
                <p>Loading tournaments...</p>
            ) : (
                <CustomSelect
                    data={tournaments}
                    config={{ key: "_id", label: "name" }}
                    label="Select Tournament"
                    onSelect={handleTournamentSelect}
                />
            )}

            {loadingStandings ? (
                <p className="mt-4">Loading team standings...</p>
            ) : teamStandings.length > 0 ? (
                <TableComponent columns={columns} data={teamStandings} />
            ) : (
                <p className="mt-4 text-gray-500">No standings available.</p>
            )}
        </div>
    );
};

export default TeamStatsPage;
