import { useEffect, useState } from "react";
import { axiosPrivate } from "../../services/config";
import Button from "../../components/Button";
import CustomSelect from "../../components/Select";

export default function ChangeUserModal({ tournamentId, player, userId,  onSuccess }) {
    console.log("player is ", player, " user id is ", userId)
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Added fetching state

  // Fetch users in the tournament
  useEffect(() => {
    async function fetchUsers() {
      setFetching(true); // Start fetching
      try {
        let response = await axiosPrivate.get(`/tournament/${tournamentId}/users`);
        setUsers(response.data.participants.filter(participant=> participant._id !== userId)); // Keep raw data, CustomSelect will handle mapping
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setFetching(false); // Stop fetching
      }
    }
    fetchUsers();
  }, [tournamentId]);

  // Handle changing owner
  async function handleChangeOwner() {
    if (!selectedUser) return alert("Please select a user");

    try {
      setLoading(true);
      await axiosPrivate.put(`/player/${tournamentId}/${player._id}/change-owner`, {
        userId: selectedUser.value, // Use value from react-select
      });

      onSuccess(); // Refresh data
    } catch (err) {
      console.error("Error updating player owner:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Change Player Owner</h2>
      <p className="mb-3 text-gray-700">
        Changing ownership for: <b>{player.name}</b>
      </p>

      {/* Loading State */}
      {fetching ? (
        <p className="text-center text-gray-600">Fetching users...</p>
      ) : (
        <CustomSelect
          data={users}
          config={{ key: "_id", label: "name" }} // CustomSelect config
          label="Select New Owner"
          onSelect={setSelectedUser} // Set selected user object
        />
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="primary" onClick={handleChangeOwner} disabled={loading || fetching}>
          {loading ? "Updating..." : "Change Owner"}
        </Button>
      </div>
    </div>
  );
}
