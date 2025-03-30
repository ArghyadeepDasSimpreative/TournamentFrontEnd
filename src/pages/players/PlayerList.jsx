import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../services/config";
import { FaArrowRight } from "react-icons/fa";

const PlayerList = ({ tournamentId, teamId }) => {
    const [teamName, setTeamName] = useState("");
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const response = await axiosPrivate.get(`/player/${tournamentId}/${teamId}`);
                setTeamName(response.data.teamName);
                setPlayers(response.data.players);
            } catch (error) {
                console.error("Error fetching players:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPlayers();
    }, [tournamentId, teamId]);

    return (
        <div className="p-4">
            {loading ? (
                <p>Loading players...</p>
            ) : (
                <>
                    {/* Header */}
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Showing players for {teamName}
                    </h2>

                    {/* Player Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {players.length > 0 ? (
                            players.map((player) => (
                                <div
                                    key={player._id}
                                    className="flex items-center justify-between p-2 border rounded-md bg-white shadow-sm hover:shadow-md transition"
                                >
                                    <div>
                                        <h3 className="text-sm font-medium">{player.name}</h3>
                                        <p className="text-xs text-gray-500">{player.position}</p>
                                    </div>
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => navigate(`/players/${tournamentId}/${player._id}`)}
                                    >
                                        <FaArrowRight size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-3 text-center">No players available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerList;
