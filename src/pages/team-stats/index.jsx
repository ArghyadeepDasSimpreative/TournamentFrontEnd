import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../services/config";
import TableComponent from "../../components/Table";
import ImageComponent from "../../components/image";

const TeamWiseStatsPage = () => {
    const { tournamentId, teamId } = useParams();

    const [teamStats, setTeamStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamStats = async () => {
            try {
                const response = await axiosPrivate.get(`/stat/${tournamentId}/${teamId}/stats`);
                setTeamStats(response.data);
            } catch (error) {
                console.error("Error fetching team stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamStats();
    }, [tournamentId, teamId]);

    const columns = [
        { key: "serial", label: "#" },
        { key: "opponentName", label: "Opponent" },
        { key: "matchType", label: "Match Type" },
        { key: "score", label: "Score" },
        {
            key: "winStatus", label: "Status", render: (row) => (
                <span
                    className={
                        row.winStatus === "won"
                            ? "text-green-600 font-semibold"
                            : row.winStatus === "lost"
                                ? "text-red-600 font-semibold"
                                : "text-yellow-600 font-semibold"
                    }
                >
                    {row.winStatus}
                </span>
            )
        }

    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Stats</h2>

            {loading ? (
                <p>Loading team stats...</p>
            ) : teamStats ? (
                <>
                    {/* Team Details */}
                    <div className="flex items-start gap-4 p-4 border border-gray-600 rounded-md shadow-md bg-white">
                        <ImageComponent src={teamStats.teamDetails.profileImage} alt={teamStats.teamDetails.teamName} className="w-16 h-16 rounded-md mr-4" type="server" />
                        <div>
                            <h3 className="text-lg font-semibold">{teamStats.teamDetails.teamName}</h3>
                            <p className="text-gray-600">Owner: {teamStats.teamDetails.name}</p>
                            <p className="text-gray-600">Players: {teamStats.teamDetails.totalPlayers}</p>
                            <p className="text-gray-600">Matches Played: {teamStats.teamDetails.totalMatchesPlayed}</p>
                            <p className="text-gray-600">Won: {teamStats.teamDetails.won}, Lost: {teamStats.teamDetails.lost}, Draw: {teamStats.teamDetails.draw}</p>
                            <p className="text-gray-600">Goals Scored: {teamStats.teamDetails.goalsScored}, Goals Conceded: {teamStats.teamDetails.goalsConceded}</p>
                            <p className="text-gray-600">Goal Difference: {teamStats.teamDetails.goalDifference}</p>
                        </div>
                    </div>

                    {/* Matches Table */}
                    <h3 className="text-lg font-semibold mt-6 mb-2">Match History</h3>
                    {teamStats.matches.length > 0 ? (
                        <TableComponent columns={columns} data={teamStats.matches} />
                    ) : (
                        <p className="text-gray-500">No matches played yet.</p>
                    )}
                </>
            ) : (
                <p className="text-gray-500">Team stats not available.</p>
            )}
        </div>
    );
};

export default TeamWiseStatsPage;
