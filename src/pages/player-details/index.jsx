import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../services/config";
import TableComponent from "../../components/Table";
import { formatCustomDate } from "../../lib/dateTime";
import PositionBadge from "../../components/position";
import { MdOutlineDelete } from "react-icons/md";
import showToast from "../../lib/toast";

const PlayerDetails = () => {
    const { tournamentId, playerId } = useParams();
    const [playerInfo, setPlayerInfo] = useState(null);
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPlayerStats() {
        try {
            setLoading(true)
            const response = await axiosPrivate.get(`/player/${tournamentId}/player/${playerId}/stats`);
            setPlayerInfo(response.data.info);
            setPlayerStats(response.data.playerStats);
        } catch (error) {
            console.error("Error fetching player stats:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPlayerStats();
    }, [tournamentId, playerId]);

    async function deleteStatById(statId) {
        try {
            let response = await axiosPrivate.delete(`/stat/${tournamentId}/${statId}`);
            if(response.status == 200)
            {
                showToast("Stat deleted successfully");
            }
        }
        catch (err) {

        }
        finally {
              fetchPlayerStats();
        }
    }

    const getBookingClass = (status) => {
        switch (status) {
            case "red":
                return "bg-red-100 text-red-600 border border-red-500";
            case "yellow":
                return "bg-yellow-100 text-yellow-600 border border-yellow-500";
            case "double yellow":
                return "bg-red-200 text-red-700 border border-red-600";
            default:
                return "bg-blue-100 text-blue-600 border border-blue-500"; // Default for "none"
        }
    };

    const columns = [
        { key: "matchTime", label: "Date", render: (row) => formatCustomDate(row.matchTime) },
        { key: "opponentTeamName", label: "Opponent Team" },
        { key: "matchType", label: "Match Type" },
        { key: "minsPlayed", label: "Minutes Played" },
        { key: "goalsScored", label: "Goals Scored" },
        { key: "rating", label: "Rating" },
        {
            key: "bookingStatus",
            label: "Booking Status",
            render: (row) => (
                <span className={`px-2 py-1 text-xs rounded-md ${getBookingClass(row.bookingStatus)}`}>
                    {row.bookingStatus === "none" ? "No" : row.bookingStatus}
                </span>
            ),
        },
        {
            key: "injuredStatus",
            label: "Injured",
            render: (row) => (
                <span
                    className={`px-2 py-1 text-xs rounded-md ${row.injuredStatus
                            ? "text-red-600 border border-red-500 bg-red-100"
                            : "text-blue-600 border border-blue-500 bg-blue-100"
                        }`}
                >
                    {row.injuredStatus ? "Yes" : "No"}
                </span>
            ),
        },
        {
            key: "_id",
            label: "Actions",
            render: (row) => (<MdOutlineDelete className="p-1 rounded-sm bg-red-200 text-red-500 hover:bg-red-500 hover:text-red-200 transition-all duration-300 text-xl cursor-pointer" onClick={() => deleteStatById(row._id)} />)
        }
    ];

    return (
        <div className="p-6">
            {loading ? (
                <p>Loading player details...</p>
            ) : (
                <>
                    {/* Player Info */}
                    {playerInfo && (
                        <div className="mb-6 p-4 flex gap-4 bg-gray-100 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{playerInfo.name}</h2>
                            <PositionBadge position={playerInfo.position} />
                        </div>
                    )}

                    {/* Player Stats Table */}
                    {playerStats.length > 0 ? (
                        <TableComponent columns={columns} data={playerStats} />
                    ) : (
                        <p className="text-gray-500 text-center mt-4">No stats available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default PlayerDetails;
