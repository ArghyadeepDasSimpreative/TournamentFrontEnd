import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import CustomSelect from "../../components/select";
import Button from "../../components/Button";
import ImageComponent from "../../components/image";
import { IoAdd, IoEye, IoTrash, IoPencil } from "react-icons/io5";
import ModalComponent from "../../components/modal";
import AddMatch from "./AddMatch";
import showToast from "../../lib/toast";
import { useNavigate } from "react-router-dom";
import { formatCustomDate } from "../../lib/dateTime";
import { confirmAlert } from 'react-confirm-alert';
import MatchesLoader from "./loader";
import UpdateScore from "./UpdateScore";

const Matches = () => {
    const navigate = useNavigate();

    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [showAddButton, setShowAddButton] = useState(false);
    const [scoreModalOpen, setScoreModalOpen] = useState(false);
    const [selectedMatch, setSelecetdMatch] = useState(null);

    async function fetchTournaments() {
        try {
            const response = await axiosPrivate.get("/tournament");
            setTournaments(response.data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    }

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchMatchesAndTeams = async () => {
        if (!selectedTournament) return;

        setLoading(true);
        try {
            const matchResponse = await axiosPrivate.get(`/match/${selectedTournament.value}`);
            let matches = matchResponse.data;

            // Sorting logic: Matches with completionTime first
            const sortedMatches = matches.sort((a, b) => {
                if (!a.completionTime || a.completionTime === null) return 1; // Move to end
                if (!b.completionTime || b.completionTime === null) return -1; // Move to end

                return new Date(a.completionTime) - new Date(b.completionTime); // Sort by completionTime
            });

            setMatches(sortedMatches);

            let response = await axiosPrivate.get(`/tournament/${selectedTournament.value}/users`);
            setTeams(response.data.participants);
            setShowAddButton(true);
        } catch (error) {
            console.error("Error fetching matches:", error);
        } finally {
            setLoading(false);
        }
    };


    const deleteMatch = async (matchId) => {
        if (!selectedTournament) return;
        else {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async() => {
                            try {
                                await axiosPrivate.delete(`/match/${selectedTournament.value}/${matchId}`);
                                setMatches(matches.filter(match => match._id !== matchId));
                                showToast("Match is deleted successfully")
                            } catch (error) {
                                console.error("Error deleting match:", error);
                            }
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => showToast("Match deletion cancelled", "info")
                    }
                ]
            })
        }

    };

    const getTotalScore = (score) => {
        return score.reduce((total, scoreItem) => total + scoreItem.score, 0);
    };

    const openScoreModal = (matchId) => {
        setSelecetdMatch(matchId);
        setScoreModalOpen(true);
    }

    const handleCb = () => {
        fetchMatchesAndTeams();
        setModalOpen(false);
        setScoreModalOpen(false);
    };

    return (
        <div className="p-4">
            <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <AddMatch tournamentId={selectedTournament?.value} cb={handleCb} teams={teams} />
            </ModalComponent>
            <ModalComponent isOpen={scoreModalOpen} onClose={()=> setScoreModalOpen(false)}>
                <UpdateScore tournamentId={selectedTournament?.value} cb={handleCb} matchId={selectedMatch} />
            </ModalComponent>
            <h2 className="text-xl font-semibold mb-4">Matches</h2>

            <div className="w-full flex justify-between items-center mb-6">
                <CustomSelect
                    label="Select Tournament"
                    data={tournaments.map((t) => ({ label: t.name, value: t._id }))}
                    config={{ key: "value", label: "label" }}
                    onSelect={setSelectedTournament}
                />
                {selectedTournament && (
                    <div className="flex items-center gap-2 justify-end">
                        <Button type="primary" onClick={fetchMatchesAndTeams}>
                            Go
                        </Button>
                        {showAddButton && (
                            <Button onClick={() => setModalOpen(true)}>
                                <IoAdd />
                                <span>Add New</span>
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <MatchesLoader />
            ) : matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {matches.map((match) => (
                        <div key={match._id} className="relative border border-gray-400 p-4 rounded-lg shadow-md flex flex-col justify-between min-h-[160px] group cursor-pointer bg-white">
                            <div className="absolute inset-0 bg-gray-300 bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                                <button className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700" onClick={() => navigate(`/matches/${selectedTournament?.value}/${match._id}`)}><IoEye size={20} /></button>
                                <button className="cursor-pointer bg-green-600 text-white p-2 rounded-full hover:bg-green-700" onClick={()=>openScoreModal(match._id)}><IoPencil size={20} /></button>
                                <button className="cursor-pointer bg-red-600 text-white p-2 rounded-full hover:bg-red-700" onClick={() => deleteMatch(match._id)}><IoTrash size={20} /></button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 w-4/9">
                                    <ImageComponent type="server" src={match.homeTeamId.profileImage} rounded={true} alt={match.homeTeamId.teamName} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-semibold">{match.homeTeamId.teamName}</span>
                                </div>
                                <span className="text-lg font-bold">
                                    {match.completed ? `${getTotalScore(match.homeTeamScore)} : ${getTotalScore(match.awayTeamScore)}` : "-- : --"}
                                </span>
                                <div className="flex items-center gap-2 w-4/9 justify-end">
                                    <span className="font-semibold">{match.awayTeamId.teamName}</span>
                                    <ImageComponent type="server" src={match.awayTeamId.profileImage} rounded={true} alt={match.awayTeamId.teamName} className="w-10 h-10 rounded-full object-cover" />
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <div className="flex flex-col items-start justify-start mx-5 my-2 h-full">
                                    {match.homeTeamScore.map((score, index) => (
                                        <div key={index} className="flex gap-2">
                                            <span>{score.playerId.name}</span><span>{score.score}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col items-start justify-start mx-5 my-2">
                                    {match.awayTeamScore.map((score, index) => (
                                        <div key={index} className="flex gap-2">
                                            <span>{score.playerId.name}</span><span>{score.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="w-full text-center">
                                {
                                    match.completed ? <span>{formatCustomDate(match.completionTime)}</span> : <span>---</span>
                                }
                            </p>
                            <p className="text-sm text-center mt-2 text-gray-500">
                                {match.completed ? <span className="rounded-sm bg-green-600 text-white px-4 py-1">Completed</span> : <span className="rounded-sm bg-red-600 text-white px-4 py-1">Upcoming</span>}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No matches found.</p>
            )}
        </div>
    );
};

export default Matches;
