import { useState } from "react";
import { axiosPrivate } from "../../services/config";
import Button from "../../components/button";
import Input from "../../components/input";

export default function AddUserModal({ tournamentId, cb }) {
  const [emailId, setEmailId] = useState("");
  const [balance, setBalance] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Handle adding user
  async function handleAddUser() {
    setError("");

    if (!isValidEmail(emailId)) {
      setError("Invalid email address");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post(`/tournament/${tournamentId}/participant`, {
        emailId,
        balance,
      });

      cb(); // Refresh data after success
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Add User</h2>

      {/* Email Input */}
      <Input
        label="Email ID"
        type="email"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        error={error}
      />

      {/* Balance Input */}
      <Input
        label="Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
      />

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="primary" onClick={handleAddUser} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </Button>
      </div>
    </div>
  );
}
