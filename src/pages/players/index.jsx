import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import Button from "../../components/Button";
import CustomSelect from "../../components/Select";
import ImageComponent from "../../components/image";
import TableComponent from "../../components/Table";
import { axiosPrivate } from "../../services/config";
import showToast from "../../lib/toast";
import ModalComponent from "../../components/modal";
import PlayerList from "./PlayerList";

export default function PlayersPage() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teamsList, setTeamsList] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [showAddButton, setShowAddButton] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [modalOpen, setModalopen] = useState(false);

    const navigate = useNavigate();

    async function fetchTournaments() {
        try {
            setPageLoading(true);
            const response = await axiosPrivate.get("/tournament");
            setTournaments(response.data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        } finally {
            setPageLoading(false);
        }
    }

    async function fetchTeams(tournament) {
        try {
            console.log("guguguu")
            setTeamsLoading(true);
            setSelectedTournament(tournament);
            const response = await axiosPrivate.get(`/tournament/${tournament.value}/users`);
            if (response.status === 200) {
                setTeamsList(response.data.participants);
                setShowAddButton(true);
            } else {
                throw new Error("Failed to fetch teams");
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to fetch teams.");
        } finally {
            setTeamsLoading(false);
        }
    }

    useEffect(() => {
        fetchTournaments();
    }, []);

    let serialNumber = -1;

    const columns = [
        {
            key: "image",
            label: "Logo",
            render: (row) => {
                console.log(row);
                return row.profileImage ? (
                    <ImageComponent
                        src={row.profileImage}
                        className="w-10 h-10 object-contain"
                        rounded
                        type="server"
                    />
                ) : (
                    <span className="text-gray-400">No Logo</span>
                )
            }
            ,
        },
        { key: "teamName", label: "Team Name" },
        { key: "name", label: "Manager" },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => handleModalOpen(row._id)}
                >
                    <IoEye />
                </button>
            ),
        },
    ];

    const handleModalOpen = (teamId) => {
        setSelectedTeam(teamId);
        setModalopen(true);
    }

    return (
        <div className="p-4">
            {pageLoading ? (
                <p>Loading tournaments...</p>
            ) : (
                <div className="w-full">
                    <ModalComponent isOpen={modalOpen} onClose={()=>setModalopen(false)}>
                        <PlayerList tournamentId={selectedTournament?.value} teamId={selectedTeam} />
                    </ModalComponent>
                    <div className="flex justify-between items-center mb-6">
                        <CustomSelect
                            label="Select Tournament"
                            data={tournaments.map((t) => ({ label: t.name, value: t._id }))}
                            config={{ key: "value", label: "label" }}
                            value={selectedTournament}
                            onSelect={fetchTeams}
                        />
                    </div>

                    {/* Show placeholder if no tournament is selected */}
                    {!selectedTournament ? (
                        <p className="text-gray-500 text-center mt-4">Please select a tournament to view participants.</p>
                    ) : teamsLoading ? (
                        <p className="text-gray-500 text-center mt-4">Loading teams...</p>
                    ) : teamsList.length > 0 ? (
                        <TableComponent columns={columns} data={teamsList} />
                    ) : (
                        <p className="text-gray-500 text-center mt-4">No data available.</p>
                    )}
                </div>
            )}
        </div>
    );
}
