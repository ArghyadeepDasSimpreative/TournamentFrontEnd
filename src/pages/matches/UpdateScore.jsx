import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Button from "../../components/Button";
import { axiosPrivate } from "../../services/config";
import ImageComponent from "../../components/image";
import CustomSelect from "../../components/Select";
import showToast from "../../lib/toast";

const UpdateScore = ({ matchId, tournamentId, cb }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/match/${tournamentId}/${matchId}/score`);
        const match = Array.isArray(response.data) ? response.data[0] : response.data;

        // Ensure scores are defined
        match.homeTeamScore = match.homeTeamScore || [];
        match.awayTeamScore = match.awayTeamScore || [];

        setMatchData(match);

        const playersResponse = await Promise.all([
          axiosPrivate.get(`/player/${tournamentId}/${match.homeTeamId._id}`),
          axiosPrivate.get(`/player/${tournamentId}/${match.awayTeamId._id}`)
        ]);

        setHomeTeamPlayers(playersResponse[0].data.players);
        setAwayTeamPlayers(playersResponse[1].data.players);
      } catch (err) {
        setError("Failed to load match data");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId, tournamentId]);

  const updateScore = (teamType, scorerId, change) => {
    setMatchData((prevData) => {
      const updatedScores = prevData[teamType].map((scorer) =>
        scorer.playerId._id === scorerId
          ? { ...scorer, score: Math.max(0, scorer.score + change) }
          : scorer
      );
      return { ...prevData, [teamType]: updatedScores };
    });
  };

  const removeScorer = (teamType, scorerId) => {
    setMatchData((prevData) => ({
      ...prevData,
      [teamType]: prevData[teamType].filter((scorer) => scorer.playerId._id !== scorerId),
    }));
  };

  const addScorer = (teamType, player) => {
    setMatchData((prevData) => {
      // Prevent duplicate add
      const alreadyExists = prevData[teamType].some((s) => s.playerId._id === player._id);
      if (alreadyExists) return prevData;

      return {
        ...prevData,
        [teamType]: [
          ...prevData[teamType],
          {
            _id: Date.now().toString(), // Temporary ID for React key
            playerId: player,
            score: 1,
          },
        ],
      };
    });
  };

  const updateFinalScores = async () => {
    try {
      const formatScores = (scores) =>
        scores.map((s) => ({
          playerId: s.playerId._id,
          playerName: s.playerId.name,
          score: s.score,
        }));

      const payload = {
        homeTeamScore: formatScores(matchData.homeTeamScore || []),
        awayTeamScore: formatScores(matchData.awayTeamScore || []),
      };

      const updateSCoreResponse = await axiosPrivate.put(`/match/${tournamentId}/${matchId}/score`, payload);
      console.log("update scor response is ", updateSCoreResponse)
      if(updateSCoreResponse.status == 200) {
        cb();
        setTimeout(function () {
          showToast("Scores updated successfully!");
        }, 1000)
      }
      
      
    } catch (error) {
      cb();
      setTimeout(function () {
        showToast(error.message, "error")
      }, 1000)
    }
  };


  if (loading) return <p className="text-center text-gray-500">Loading match details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!matchData) return null;

  const usedIds = {
    homeTeamScore: matchData.homeTeamScore?.map((p) => p.playerId._id) || [],
    awayTeamScore: matchData.awayTeamScore?.map((p) => p.playerId._id) || [],
  };

  const getSelectablePlayers = (teamType, allPlayers) => {
    return allPlayers.filter((p) => !usedIds[teamType].includes(p._id));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      {/* Team Info */}
      <div className="flex justify-between items-center mb-4">
        {[matchData.homeTeamId, matchData.awayTeamId].map((team, index) => (
          <div key={index} className="flex items-center gap-4">
            <ImageComponent src={team.profileImage} type="server" className="w-10 h-10" />
            <div>
              <h2 className="text-lg font-bold">{team.teamName}</h2>
              <p className="text-gray-600">Owner: {team.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scores Table */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { type: "homeTeamScore", team: matchData.homeTeamId.teamName, players: homeTeamPlayers },
          { type: "awayTeamScore", team: matchData.awayTeamId.teamName, players: awayTeamPlayers },
        ].map(({ type, team, players }) => (
          <div key={type} className="p-4 bg-white rounded-md shadow-md">
            <h3 className="text-md font-semibold text-gray-700 mb-2">{team} Scores</h3>

            <CustomSelect
              data={getSelectablePlayers(type, players)}
              config={{ key: "_id", label: "name" }}
              label={`Add Scorer for ${team}`}
              onSelect={(option) => {
                const player = players.find((p) => p._id === option.value);
                if (player) addScorer(type, player);
              }}
            />

            {matchData[type]?.length > 0 ? (
              <ul className="mt-4">
                {matchData[type].map((scorer) => (
                  <li key={scorer._id} className="flex justify-between items-center border-b py-2">
                    <span className="text-gray-700">{scorer.playerId.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateScore(type, scorer.playerId._id, -1)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-gray-900 font-medium">{scorer.score}</span>
                      <button
                        onClick={() => updateScore(type, scorer.playerId._id, 1)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => removeScorer(type, scorer.playerId._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic mt-4">No scores yet.</p>
            )}
          </div>
        ))}
      </div>

      {/* Finalize Button */}
      <div className="mt-4 flex justify-center">
        <Button onClick={updateFinalScores} type="primary">
          Update
        </Button>
      </div>
    </div>
  );
};

export default UpdateScore;
