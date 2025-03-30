import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosPrivate } from '../../services/config';
import CustomSelect from '../../components/select';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import showToast from '../../lib/toast';

const MatchDetailsPage = () => {
    const { tournamentId, id } = useParams();
    const [match, setMatch] = useState(null);
    const [homePlayers, setHomePlayers] = useState([]);
    const [awayPlayers, setAwayPlayers] = useState([]);
    const [homeSelectedPlayers, setHomeSelectedPlayers] = useState([]);
    const [awaySelectedPlayers, setAwaySelectedPlayers] = useState([]);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/match/${tournamentId}/${id}`);
                setMatch(response.data);
            } catch (error) {
                toast.error('Failed to load match details');
            }
        };

        fetchMatchDetails();
    }, [tournamentId, id]);

    useEffect(() => {
        if (match) {
            const fetchPlayers = async (teamId, setPlayers) => {
                try {
                    const response = await axiosPrivate.get(`/player/${tournamentId}/${teamId}`);
                    setPlayers(response.data.players);
                } catch (error) {
                    toast.error('Failed to load players');
                }
            };

            fetchPlayers(match.homeTeamId._id, setHomePlayers);
            fetchPlayers(match.awayTeamId._id, setAwayPlayers);
        }
    }, [match, tournamentId]);

    const addPlayer = (player, setSelectedPlayers) => {

        setSelectedPlayers(prev => {
            if (prev.some(playerItem => 
            {
                console.log(playerItem, " and ", player);
                return playerItem.value == player.value
            }
            )) {
                showToast(`${player.label} is already added`);
                return prev
            }
            else return ([...prev, player])
        }
        );
    };

    const removePlayer = (playerId, setSelectedPlayers) => {
        setSelectedPlayers(prev => prev.filter(p => p.value !== playerId));
    };

    if (!match) return <div>Loading match details...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Match Details</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold">{match.homeTeamId.name}</h3>
                    <CustomSelect
                        header="Plase selec home team players"
                        config={{ label: "label", key: "value" }}
                        data={homePlayers.map(p => {
                            return ({ value: p._id, label: p.name })
                        }
                        )}
                        onSelect={(player) => addPlayer(player, setHomeSelectedPlayers)}
                    />
                    <ul className="mt-2">
                        {homeSelectedPlayers.map(player => {
                            console.log("player is ", player);
                            return (
                                <li key={player.value} className="flex justify-between items-center">
                                    {player.label}
                                    <button className="text-red-500 bg-red-200 cursor-pointer rounded-sm p-2" onClick={() => removePlayer(player.value, setHomeSelectedPlayers)}><FaTrash /></button>
                                </li>
                            )
                        }
                        )}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold">{match.awayTeamId.name}</h3>
                    <CustomSelect
                        header="Please select away team players"
                        config={{ label: "label", key: "value" }}
                        data={awayPlayers.map(p => ({ value: p._id, label: p.name }))}
                        onSelect={(player) => addPlayer(player, setAwaySelectedPlayers)}
                    />
                    <ul className="mt-2">
                        {awaySelectedPlayers.map(player => (
                            <li key={player.value} className="flex justify-between items-center">
                                {player.label}
                                <button className="text-red-500 bg-red-200 cursor-pointer rounded-sm p-2" onClick={() => removePlayer(player.value, setAwaySelectedPlayers)}><FaTrash /></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailsPage;
