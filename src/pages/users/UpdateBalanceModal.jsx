import { useState } from "react";
import { axiosPrivate } from "../../services/config";
import Button from "../../components/button";
import Input from "../../components/input";
import CustomSelect from "../../components/select";

export default function UpdateBalanceModal({ user, tournamentId, cb }) {
    console.log("seleced tournames id is ", tournamentId)
  const [balance, setBalance] = useState(user.balance);
  const [type, setType] = useState("add"); // Default to "add"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const typeOptions = [
    { value: "add", label: "Add" },
    { value: "subtract", label: "Subtract" },
  ];

  // Handle balance update
  async function handleUpdateBalance() {
    if (balance < 0) {
      setError("Balance cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.put(`/user/${tournamentId}/${user.userId}/balance`, {
        balance,
        type,
      });

      cb(); // Refresh data
    } catch (err) {
      console.error("Error updating balance:", err);
      setError("Failed to update balance. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Update Balance</h2>
      <p className="mb-3 text-gray-700">
        Updating balance for: <b>{user.userName}</b>
      </p>

      {/* Balance Input */}
      <Input
        label="New Balance"
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
        error={error}
      />

      {/* Type Selection */}
      <CustomSelect
        data={typeOptions}
        config={{ key: "value", label: "label" }}
        label="Transaction Type"
        onSelect={(selected) => setType(selected.value)}
      />

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="primary" onClick={handleUpdateBalance} disabled={loading}>
          {loading ? "Updating..." : "Update Balance"}
        </Button>
      </div>
    </div>
  );
}
