import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../../services/config";
import { useEffect, useState } from "react";
import CustomSelect from "../../components/select";
import InputComponent from "../../components/input";
import Button from "../../components/Button";
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { sortPlayersByPosition } from "../../lib/array";
import PositionBadge from "../../components/position";
import showToast from "../../lib/toast";
import PlayingStatus from "../../components/PlayingStatus";
import { getShortenedName } from "../../lib/text";
import ModalComponent from "../../components/modal";
import SubstitutionModal from "./SubstitutionModal";

const bookingOptions = [
  { value: "none", label: "None" },
  { value: "yellow", label: "Yellow Card" },
  { value: "red", label: "Red Card" },
];

const MatchDetailspage = () => {
  const [homeTeamDetails, setHomeTeamDetails] = useState(null);
  const [awayTeamDetails, setAwayTeamDetails] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [statRecordLoaing, setStatRecordLoading] = useState(false);
  const [matchCompletion, setMatchCompletion] = useState(false);
  const { tournamentId, id } = useParams();
  const [subModal, setSubModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [substitutingTeamDetails, setSubstitutingTeamDetails] = useState([]);

  const navigate = useNavigate();

  async function getTeams() {
    try {
      setPageLoading(true);
      let teamsResponse = await axiosPrivate.get(`/match/${tournamentId}/${id}`);
      let response = await Promise.all([
        axiosPrivate.get(`/player/${tournamentId}/${teamsResponse.data.homeTeamId._id}/${id}/get-all-stats`),
        axiosPrivate.get(`/player/${tournamentId}/${teamsResponse.data.awayTeamId._id}/${id}/get-all-stats`)
      ]);

      if (response[0].status == 200 && response[1].status == 200) {
        let matchCompletionResponse = await axiosPrivate.get(`/match/${tournamentId}/${id}/status`);
        setMatchCompletion(matchCompletionResponse.data.completed);
        let matchResponse = await Promise.all([
          axiosPrivate.get(`/stat/${tournamentId}/match/${id}/team/${teamsResponse.data.homeTeamId._id}`),
          axiosPrivate.get(`/stat/${tournamentId}/match/${id}/team/${teamsResponse.data.awayTeamId._id}`)
        ])
        let homeTeamMatchData = matchResponse[0].data;
        let awayTeamMatchData = matchResponse[1].data;
        let homeTeamPlayerData = response[0].data.players.map(player => {
          let playerExists = homeTeamMatchData.find(p => {
            return p.name == player.name
          }
          );
          if (playerExists) {
            return {
              playingStatus: playerExists.playingStatus,
              bookingStatus: playerExists.bookingStatus,
              goalsScored: playerExists.goalsScored,
              injuryStatus: playerExists.injuredStatus,
              startTime: 0,
              endTime: 90,
              totalPlayTime: 90, // Static value
              playtimeLeft: 1500 - 90, // Playtime left calculation
              ...player
            };
          } else {
            return {
              playingStatus: false,
              bookingStatus: "none",
              goalsScored: 0,
              injuryStatus: false,
              startTime: 0,
              endTime: 90,
              totalPlayTime: 90, // Static value
              playtimeLeft: 1500 - 90, // Playtime left calculation
              ...player
            };
          }
        });

        let awayTeamPlayerData = response[1].data.players.map(player => {
          let playerExists = awayTeamMatchData.find(p => p.name == player.name);
          if (playerExists) {
            return {
              playingStatus: playerExists.playingStatus,
              bookingStatus: playerExists.bookingStatus,
              goalsScored: playerExists.goalsScored,
              injuryStatus: playerExists.injuredStatus,
              startTime: 0,
              endTime: 90,
              totalPlayTime: 90, // Static value
              playtimeLeft: 1500 - 90, // Playtime left calculation
              ...player
            };
          } else {
            return {
              playingStatus: false,
              bookingStatus: "none",
              goalsScored: 0,
              injuryStatus: false,
              startTime: 0,
              endTime: 90,
              totalPlayTime: 90, // Static value
              playtimeLeft: 1500 - 90, // Playtime left calculation
              ...player
            };
          }
        });
        setHomeTeamDetails({ _id: response[0].data._id, name: response[0].data.name, players: sortPlayersByPosition(homeTeamPlayerData, "name") });
        setAwayTeamDetails({ _id: response[1].data._id, name: response[1].data.name, players: sortPlayersByPosition(awayTeamPlayerData, "name") });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }

  const handleGoal = (type, playerId) => {
    const homeTeamPlayerFound = homeTeamDetails.players.find(player => player._id == playerId);
    console.log("home team players found ", homeTeamPlayerFound)
    if (!homeTeamPlayerFound) {
      const awayTeamPlayerFound = awayTeamDetails.players.find(player => player._id == playerId);
      console.log("away team player found ", awayTeamPlayerFound)
      if (!awayTeamPlayerFound) {
        showToast("Something wrong while adding the players")
      }
      else {
        let playerGoal = awayTeamPlayerFound.goalsScored;
        setAwayTeamDetails(prev => {
          let elsePlayers = prev.players.filter(player => player._id != playerId);
          let allPlayers = [...elsePlayers, { ...awayTeamPlayerFound, goalsScored: type == "add" ? playerGoal + 1 : playerGoal - 1 }];
          return ({ _id: prev._id, name: prev.name, players: sortPlayersByPosition(allPlayers, "name") })
        })
      }
    }
    else {
      let playerGoal = homeTeamPlayerFound.goalsScored;
      setHomeTeamDetails(prev => {
        let elsePlayers = prev.players.filter(player => player._id != playerId);
        console.log("else players is ", elsePlayers)
        console.log({ ...homeTeamPlayerFound, goalsScored: type == "add" ? playerGoal + 1 : playerGoal - 1 })
        let allPlayers = [...elsePlayers, { ...homeTeamPlayerFound, goalsScored: type == "add" ? playerGoal + 1 : playerGoal - 1 }];
        return ({ _id: prev._id, name: prev.name, players: sortPlayersByPosition(allPlayers, "name") })
      })
    }
  }

  async function handleRecordSubmit() {
    try {
      setSubmitLoading(true);
      setSubmitDisabled(true);
      console.log("homeTeam details is ", homeTeamDetails, " and away team details is ", awayTeamDetails)
      setStatRecordLoading(true);
      let homeTeamPlayed = homeTeamDetails.players.filter(player => player.playingStatus).map(player => {
        return ({ _id: player._id, name: player.name, goalsScored: player.goalsScored, minsPlayed: player.endTime - player.startTime, injuryStatus: player.injuryStatus, bookingStatus: player.bookingStatus, playingStatus: player.playingStatus })
      });
      let awayTeamPlayed = awayTeamDetails.players.filter(player => player.playingStatus).map(player => {
        return ({ _id: player._id, name: player.name, goalsScored: player.goalsScored, minsPlayed: player.endTime - player.startTime, injuryStatus: player.injuryStatus, bookingStatus: player.bookingStatus, playingStatus: player.playingStatus })
      });
      let homeTeamNotPlayed = homeTeamDetails.players.filter(player => !player.playingStatus).map(player => {
        console.log("plyerrr is ", player)
        return ({ _id: player._id, name: player.name, goalsScored: player.goalsScored, minsPlayed: 0, injuryStatus: player.injuryStatus, bookingStatus: player.bookingStatus, playingStatus: player.playingStatus })
      });
      console.log("not played players of hometeam are ", homeTeamNotPlayed)
      let awayTeamNotPlayed = awayTeamDetails.players.filter(player => !player.playingStatus).map(player => {
        return ({ _id: player._id, name: player.name, goalsScored: player.goalsScored, minsPlayed: 0, injuryStatus: player.injuryStatus, bookingStatus: player.bookingStatus, playingStatus: player.playingStatus })
      });
      let homeTeamPlayers = [...homeTeamPlayed, ...homeTeamNotPlayed]
      console.log("hohohohoho", homeTeamPlayers);
      let awayTeamPlayers = [...awayTeamPlayed, ...awayTeamNotPlayed]
      if (homeTeamPlayers.length < 11 || awayTeamPlayers.length < 11) {
        showToast("Please make sure the teams have minimum 11 players playing", "error");
      }
      else {
        let payload = {
          matchId: id,
          homeTeamDetails: {
            ...homeTeamDetails, players: homeTeamPlayers
          },
          awayTeamDetails: {
            ...awayTeamDetails, players: awayTeamPlayers
          }
        }
        console.log(payload)
        let response = await axiosPrivate.post(`/stat/${tournamentId}/match/${id}`, payload);
        if (response.status == 201) {
          let matchCompletionResponse = await axiosPrivate.put(`/match/${tournamentId}/${id}/toggle-completion`);
          console.log("match completion record is ", matchCompletionResponse)
          if (matchCompletionResponse.status == 200) {
            showToast(matchCompletionResponse.data.message);
            setTimeout(() => navigate("/matches"), 1000);
          }
        }
        else {
          throw new Error("Failed to add the records.");
        }
      }
    }
    catch (err) {
      showToast(err.response.data.message ? err.response.data.message : "Failed to add the records.");
    }
    finally {
      setStatRecordLoading(false);
      setSubmitLoading(false);
      setSubmitDisabled(false);
    }
  }

  function getGoalScorers(players) {
    console.log("players is ", players)
    let scorers = players.filter(player => player.goalsScored > 0);
    return scorers;

  }

  function getBookingDefaultValue(param) {
    const optionFound = bookingOptions.find(option => option.value == param);
    return optionFound;
  }

  function handleSubModal(teamDetails) {
    setSubModal(true);
    console.log(teamDetails);
    setSubstitutingTeamDetails(teamDetails);
    
  }

  function handleSubConfirm(updatedPlayers) {
    console.log("updated players are ", updatedPlayers);
    console.log("home team owner is ", homeTeamDetails.name)
    console.log("away team owner is ", awayTeamDetails.name)
    console.log("substituting team details are ", updatedPlayers.name)
    if (homeTeamDetails.name == updatedPlayers.name) {
      console.log("setting players for ", homeTeamDetails.name)
      setHomeTeamDetails(prev=> ({...prev, players: updatedPlayers.players}));

    }
    else {
      setAwayTeamDetails(prev=> ({...prev, players: updatedPlayers.players}));
      console.log("setting players for ", awayTeamDetails.name)
    }
    setSubModal(false);
  }


  useEffect(() => {
    getTeams();
  }, []);

  // useEffect(function() {
  //   let homeTeamPlayed = homeTeamDetails?.players.filter(player => player.playingStatus);
  //   let awayTeamPlayed = awayTeamDetails?.players.filter(player => player.playingStatus);
  //   setSubmitDisabled(homeTeamPlayed >= 11 && awayTeamPlayed >= 11 ? true : true)
  // })

  return (
    <div className="p-4 flex flex-col items-center w-full">
      {pageLoading ? (
        <>...loading</>
      ) : (
        <>
          <header className="text-xl font-semibold mb-4">Match Details</header>
          <div className="flex justify-between gap-6 w-full mb-5">
            {/* Team Component */}
            {[
              { teamDetails: homeTeamDetails, setTeamDetails: setHomeTeamDetails },
              { teamDetails: awayTeamDetails, setTeamDetails: setAwayTeamDetails }
            ].map(({ teamDetails, setTeamDetails }, teamIndex) => {
              console.log("from render players list are ", teamDetails)
              return (
                <div key={teamIndex} className="flex flex-col justify-start w-1/2">

                  <div className="w-full flex justify-between items-center"><p className="text-xl font-semibold mb-4">{teamDetails?.name}</p>
                    <p>
                      {
                        teamDetails?.players.filter(player => player.playingStatus == true).length
                      } players playing
                    </p>
                  </div>
                  {
                    teamDetails?.players.filter(player => player.playingStatus).length >= 11 ?
                      <Button onClick={() => handleSubModal(teamDetails)}>Make Sub</Button>
                      :
                      <Button disabled={true}>Make Sub</Button>
                  }
                  <ModalComponent isOpen={subModal} onClose={() => setSubModal(false)}>
                    <SubstitutionModal teamDetails={substitutingTeamDetails} onConfirm={handleSubConfirm} />
                  </ModalComponent>
                  <div className={`border border-gray-300 p-2 my-4 gap-2 rounded-md flex flex-col overflow-y-scroll h-[75px] ${teamIndex % 2 == 0 ? "items-start" : "items-end"} justify-between gap-1`}>
                    {
                      teamDetails?.players.length !== 0 ? teamDetails?.players.filter(player => player.goalsScored > 0).map(player =>
                        <div className="flex gap-2 bg-slate-300 rounded-sm px-2 py-1">
                          <span>{player?.name}</span><span className="font-semibold">{player?.goalsScored}</span>
                        </div>

                      )
                        :
                        <p className="text-lg font-semibold">No Scorer available</p>
                    }
                  </div>
                  <div className="w-full flex flex-col gap-3 p-2 border border-slate-300 rounded-md mb-4 bg-white">
                    <header className="w-full font-semibold">Will Expire Soon</header>
                    <div className="flex gap-2 flex-wrap w-full h-[100px] overflow-y-scroll">
                      {
                        teamDetails?.players.filter(player => {
                          let playTime = player.position == "GK" ? 1600 - player.playTime : 1300 - player.playTime;
                          return playTime < 90
                        }
                        )
                          .map(player => <div className="flex gap-2 bg-slate-900 px-2 p-1 rounded-lg text-xs text-white inline"><span className="font-normal">{getShortenedName(player.name)}</span>
                            <span className="text-red-400">{player.position == "GK" ? 1600 - player.playTime : 1300 - player.playTime} mins</span></div>)
                      }
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    {teamDetails?.players.map((player, index) => {
                      return (
                        <div key={index} className={`relative border-2 ${player.available != "yes" && player.available != "yellow" ? "border-red-600 bg-red-100" : !player.playingStatus ? "border-gray-300 bg-white" : "border-green-700 bg-green-100"} px-3 py-2 rounded-md w-full mb-2 transition-all duration-300`}>
                          <PlayingStatus status={player.available} />
                          {/* Top Row - Play Status & Name */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex justify-start gap-2 items-center">
                                <div className={`flex justify-start gap-2 py-1 px-2 ${player.available != "yes" && player.available != "yellow" ? "border-red-600 bg-red-300  cursor-not-allowed" : player.playingStatus ? "bg-green-400 cursor-pointer" : "bg-slate-300 cursor-pointer"} rounded-sm`} onClick={() => {
                                  // if(!player.playingStatus) {
                                  //   player.startTime = 0;
                                  //   player.endTime = 0;
                                  // }
                                  // else {
                                  //   player.startTime = 0;
                                  //   player.endTime = 90;
                                  // }
                                  if (player.available == "yes" || player.available == "yellow") {
                                    player.playingStatus = !player.playingStatus;

                                    setTeamDetails({ ...teamDetails });
                                  }
                                  else {
                                    return
                                  }
                                }}>
                                  {/* <input
                                  type="checkbox"
                                  checked={player.playingStatus}
                                  className="cursor-pointer"
                                  onChange={() => {
                                    player.playingStatus = !player.playingStatus;
                                    setTeamDetails({ ...teamDetails });
                                  }}
                                /> */}
                                  <span className="text-lg font-semibold">{player.name}</span>
                                </div>
                                <PositionBadge position={player.position} />
                              </div>
                            </div>
                          </div>
                          {
                            player.playingStatus ?
                              <>
                                {/* Middle Row - Booking Status */}
                                <div className="mt-2 flex items-center justify-between gap-4">
                                  <CustomSelect
                                    data={bookingOptions}
                                    config={{ key: "value", label: "label" }}
                                    label="Booking Status"
                                    onSelect={(selected) => {
                                      player.bookingStatus = selected.value;
                                      setTeamDetails({ ...teamDetails });
                                    }}
                                    defaultValue={player?.bookingStatus ? getBookingDefaultValue(player.bookingStatus) : null}
                                  />
                                  <div className="mt-2 flex items-center gap-4">
                                    <InputComponent
                                      type="number"
                                      value={player.startTime}
                                      label="Start Time"
                                      onChange={(e) => {
                                        player.startTime = Number(e.target.value);
                                        setTeamDetails({ ...teamDetails });
                                      }}
                                    />
                                    <InputComponent
                                      type="number"
                                      value={player.endTime}
                                      label="End Time"
                                      onChange={(e) => {
                                        player.endTime = Number(e.target.value);
                                        setTeamDetails({ ...teamDetails });
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <button className={`p-1 text-white  hover:bg-gray-800 transition-all duration-300 rounded-sm ${!player.playingStatus ? "cursor-pointer bg-gray-950" : "cursor-pointer bg-gray-800"}`} onClick={() => handleGoal("add", player._id)}><IoIosAdd /></button>
                                    <span className="px-2 py-2 font-semibold text-lg">{player.goalsScored}</span>
                                    <button
                                      className={`p-1 text-white transition-all duration-300 rounded-sm 
                               ${player.goalsScored > 0 ? "cursor-pointer bg-gray-950 hover:bg-gray-800" : "cursor-pointer bg-gray-700 opacity-50"}
                                `}
                                      onClick={() => handleGoal("minus", player._id)}
                                      disabled={player.goalsScored < 1}
                                    >
                                      <FiMinus />
                                    </button>

                                  </div>
                                </div>

                                {/* Bottom Row - Start Time, End Time, Injury Status */}

                                {/* Extra Row - Playtime & Playtime Left */}
                                {/* <div className="mt-2 p-2 rounded-md text-sm flex justify-between bg-blue-100">
                                  <span className="text-green-600 font-medium">Total Playtime: {player.totalPlayTime} mins</span>
                                  <span className="text-red-600 font-medium">Playtime Left: {player.playtimeLeft} mins</span>
                                </div> */}

                                {/* Injury Status Row */}
                                <div className="mt-2 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={player.injuryStatus}
                                    onChange={() => {
                                      player.injuryStatus = !player.injuryStatus;
                                      setTeamDetails({ ...teamDetails });
                                    }}
                                  />
                                  <span className="font-semibold text-md">Injured</span>
                                </div></>
                              :
                              <div className="w-full h-[50px] rounded-sm bg-slate-100 mt-2 flex justify-center items-center font-semibold text-xl">
                                {
                                  matchCompletion ? "Did not play" : "Not playing"
                                }
                              </div>
                          }
                          <div className="mt-4 rounded-sm flex items-center justify-between px-2 py-1 text-sm bg-slate-900 text-white">
                            <span>{player.playTime} mins played</span>
                            <span className={player.position == "GK" ? "text-yellow-300" : "text-white"}>{player.position == "GK" ? 1600 - player.playTime : 1300 - player.playTime} mins left</span>
                          </div>
                        </div>
                      )
                    }
                    )}
                  </div>
                </div>
              )
            }
            )}
          </div>

          {
            matchCompletion ? <Button onClick={() => console.log("ghghgh")}>Update Record</Button>
              :
              <Button disabled={submitDisabled} loading={submitLoading} onClick={() => handleRecordSubmit()}>Submit</Button>
          }

        </>
      )}
    </div>
  );
};

export default MatchDetailspage;
