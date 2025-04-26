import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../services/config";
import { FaArrowRight } from "react-icons/fa";
import ImageComponent from "../../components/image";

const PlayerList = ({ tournamentId, teamId }) => {
    const [teamName, setTeamName] = useState("");
    const [teamImage, setTeamImage] = useState("");
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const response = await axiosPrivate.get(`/user/${tournamentId}/${teamId}/play-time`);
                console.log(response)
                setTeamName(response.data.teamName);
                setTeamImage(response.data.teamLogo);
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
                    <div className="inline-flex justify-start gap-5 my-4 border border-slate-300 p-3 rounded-md w-auto max-w-fit"
                    >
                        <ImageComponent type="server" src={teamImage} className="w-12 h-12" />
                        <div className="flex flex-col justify-between">
                            <p className="text-lg font-semibold">{teamName}</p>
                            <span>{players.length} players</span>
                        </div>
                    </div>

                    {/* Player Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 max-h-[40vh] overflow-scroll bg-slate-200 p-3 rounded-md">
                        {players.length > 0 ? (
                            players.map((player) => (
                                <div
                                    key={player._id}
                                    className="min-h-[80px] flex items-center justify-between p-2 border border-slate-300 rounded-md bg-white shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex flex-col justify-between w-full h-full">
                                        <h3 className="text-sm font-medium mb-2">{player.name}</h3>
                                        <div className="mt-auto">
                                            <span className="inline-block rounded-sm bg-cyan-600 text-white text-xs px-2 py-1">
                                                {player.totalPlayTime} mins
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="text-blue-500 hover:text-blue-700 bg-blue-200 rounded-[50%] p-1 border border-blue-500 cursor-pointer"
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
