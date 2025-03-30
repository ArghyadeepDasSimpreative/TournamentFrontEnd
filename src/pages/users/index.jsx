import { useEffect, useState } from "react"
import { axiosPrivate } from "../../services/config"
import CustomSelect from "../../components/select"
import Button from "../../components/button"
import Table from "../../components/table"
import { HiEye } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { useTournament } from "../../context/TournamentContext"
import { IoAdd } from "react-icons/io5";
import ModalComponent from "../../components/modal"
import AddUserModal from "./AddUserModal"
import { FaWallet } from "react-icons/fa6";
import UpdateBalanceModal from "./UpdateBalanceModal"

const UsersPage = () => {
  const { selectedTournament, setSelectedTournament } = useTournament()
  const [playersData, setPlayersData] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [showTable, setShowTable] = useState(!!selectedTournament) // Show if tournament exists
  const [modalOpen, setModalOpen] = useState(false);
  const [balanceUpdateModalOpen, setBalanaceUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  async function getAllPlayersData() {
    if (!selectedTournament) return

    try {
      setTableLoading(true)
      const response = await axiosPrivate.get(`/user/${selectedTournament.value}`)
      setPlayersData(response.data)
      setShowTable(true) // Ensure table remains visible
    } catch (err) {
      console.error("Error fetching players data", err)
    } finally {
      setTableLoading(false)
    }
  }

  async function getAllTournaments() {
    try {
      setLoading(true)
      const response = await axiosPrivate.get("/tournament")
      setTournaments(response.data)
    } catch (err) {
      console.error("Error fetching tournaments", err)
    } finally {
      setLoading(false)
    }
  }

  function handleBalanceModalOpen(user, param) {
     setSelectedUser(user);
     setBalanaceUpdateModalOpen(param == "open" ? true : false);
  }

  function handleSelect(e) {
    setSelectedTournament(e) // Store in context
    setShowTable(false) // Hide table until "Go" is clicked
  }

  function handleCb() {
    getAllPlayersData();
    setModalOpen(false);
    setSelectedUser(null);
    setBalanaceUpdateModalOpen(false);
  }

  useEffect(() => {
    getAllTournaments()
    if (selectedTournament) {
      getAllPlayersData()
    }
  }, [])

  // Table columns
  const columns = [
    { key: "userName", label: "Name" },
    { key: "balance", label: "Balance" },
    { key: "playerCount", label: "Players Bought" },
    { key: "actions", label: "Actions" },
  ]

  // Transform API data for the table
  const tableData = playersData.map((user) => ({
    userName: user.userName,
    balance: user.balance ?? 0,
    playerCount: user.players.length,
    actions: (
      <>
        <button onClick={() => navigate(`/users/${user.userId}/${selectedTournament.value}/players`)} className="text-gray-600 cursor-pointer hover:text-gray-800">
          <HiEye size={20} />
        </button>
        <button onClick={() => handleBalanceModalOpen(user, "open")} className="ml-3 text-gray-600 cursor-pointer hover:text-gray-800">
          <FaWallet size={20} />
        </button>
      </>

    ),
  }))

  return (
    <div className="w-full flex flex-col p-4">
      {loading ? (
        <p className="text-center text-gray-600">...loading tournaments</p>
      ) : (
        <div className="w-full flex flex-col">
          <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <AddUserModal cb={handleCb} tournamentId={selectedTournament?.value} />
          </ModalComponent>
          <ModalComponent isOpen={balanceUpdateModalOpen} onClose={() => handleBalanceModalOpen(null, "close")}>
            <UpdateBalanceModal user={selectedUser} cb={handleCb} tournamentId={selectedTournament?.value} />
          </ModalComponent>
          <div className="w-full flex flex-row justify-between items-center mb-4">
            <CustomSelect
              data={tournaments}
              config={{ key: "_id", label: "name" }}
              label="Please select a tournament"
              onSelect={handleSelect}
              value={selectedTournament} // Preselect from context
            />
            {selectedTournament && (
              <Button type="primary" onClick={getAllPlayersData}>
                Go
              </Button>
            )}
          </div>

          {/* Show table only after clicking "Go" */}
          {showTable && (
            tableLoading ? (
              <p className="text-center text-gray-600">Loading players...</p>
            ) : (
              <div className="flex flex-col w-full justify-between gap-4">
                <div className="w-full flex items-center justify-end">
                  <Button onClick={() => setModalOpen(true)}>
                    <IoAdd />
                    <span>Add New</span>
                  </Button>
                </div>
                <Table columns={columns} data={tableData} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default UsersPage
