import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { axiosPrivate } from "../../services/config"
import TableComponent from "../../components/Table"
import Button from "../../components/Button"
import { IoAdd, IoTrash, IoPencil } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import ModalComponent from "../../components/modal"
import AddPlayerModal from "./AddPlayerModal"
import ChangeUserModal from "./ChangeUserModal"
import UpdatePlayerModal from "./UpdatePlayerModal"

const UserPlayers = () => {
  const { userId, tournamentId } = useParams()
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  async function getUserWisePlayers() {
    try {
      setLoading(true)
      const response = await axiosPrivate.get(`/player/${tournamentId}/${userId}`)
      const { name, balance, players } = response.data
      setName(name)
      setBalance(balance)
      setPlayers(players || []) // Ensure players array is not undefined
    } catch (err) {
      console.error("Error fetching user players", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletePlayer(playerId) {
    try {
      let response = await axiosPrivate.delete(`/player/${tournamentId}/${userId}/${playerId}`);
      setBalance(response.data.balance);
      setPlayers(players.filter(player => player._id !== playerId))
    } catch (err) {
      console.error("Error deleting player", err)
    }
  }


  useEffect(() => {
    getUserWisePlayers()
  }, [])

  // Categorizing players by position
  const positionCounts = {
    Goalkeepers: players.filter(p => p.position === "GK").length,
    Defenders: players.filter(p => ["CB", "LB", "RB", "LWB", "RWB"].includes(p.position)).length,
    Midfielders: players.filter(p => ["CM", "CDM", "CAM", "LM", "RM"].includes(p.position)).length,
    Forwards: players.filter(p => ["ST", "LW", "RW"].includes(p.position)).length,
  }

  // Table columns
  const columns = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "price", label: "Price" },
    {
      key: "overall", label: "Overall"
    },
    {
      key: "actions",
      label: "Actions",
      render: (player) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleDeletePlayer(player._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
            <IoTrash size={20} />
          </button>
          <button onClick={() => { setSelectedPlayer(player); setEditModalOpen(true) }} className="text-green-700 hover:text-green-900 cursor-pointer">
            <FaExchangeAlt size={20} />
          </button>
          <button onClick={() => { setSelectedPlayer(player); setUpdateModalOpen(true) }} className="text-blue-500 hover:text-blue-700 cursor-pointer">
            <IoPencil size={20} />
          </button>
        </div>
      ),
    },
  ]

  const handleCb = () => {
    setModalOpen(false)
    setEditModalOpen(false)
    setUpdateModalOpen(false);
    getUserWisePlayers()
  }

  return (
    <div className="w-full flex flex-col p-4">
      {loading ? (
        <p className="text-center text-gray-600">Loading players...</p>
      ) : (
        <div className="w-full flex flex-col">
          {/* Add Player Modal */}
          <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <AddPlayerModal name={name} userId={userId} tournamentId={tournamentId} cb={handleCb} />
          </ModalComponent>

          {/* Edit Player Modal */}
          <ModalComponent isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <ChangeUserModal player={selectedPlayer} tournamentId={tournamentId} onSuccess={handleCb} userId={userId} />
          </ModalComponent>

          <ModalComponent isOpen={updateModalOpen} onClose={()=> setUpdateModalOpen(false)}>
            <UpdatePlayerModal cb={handleCb} playerId={selectedPlayer?._id} tournamentId={tournamentId} userId={userId} />
          </ModalComponent>

          {/* Player Statistics */}
          <div className="flex justify-between w-full items-center mb-5">
            <header className="text-xl">Showing players of <span className="font-semibold">{name}</span></header>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              <IoAdd className="text-white h-6 w-6" />
              Add new
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(positionCounts).map(([category, count]) => (
              <div key={category} className="p-1 border border-gray-400 rounded-lg shadow-sm bg-gray-100 text-center">
                <h3 className="text-lg font-semibold">{category}</h3>
                <p className="text-xl font-bold">{count}</p>
              </div>
            ))}
          </div>

          {/* Balance */}
          <div className="mb-4 text-lg font-semibold text-gray-700">
            Balance: <span className="text-green-600">${balance}</span>
          </div>

          {/* Players Table */}
          <TableComponent columns={columns} data={players} />
        </div>
      )}
    </div>
  )
}

export default UserPlayers
