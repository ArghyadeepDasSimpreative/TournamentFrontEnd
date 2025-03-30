import React from "react";

const getPositionColor = (position) => {
  const defensePositions = ["RB", "RWB", "CB", "LB", "LWB"];
  const midfieldPositions = ["CDM", "CM", "CAM", "RM", "LM"];
  const strikerPositions = ["ST", "RW", "LW"];

  if (position === "GK") return "bg-yellow-500"; 
  if (defensePositions.includes(position)) return "bg-green-700";
  if (midfieldPositions.includes(position)) return "bg-blue-800";
  if (strikerPositions.includes(position)) return "bg-red-500";

  return "bg-gray-500"; // Default for unknown positions
};

const PositionBadge = ({ position }) => {
  return (
    <div
      className={`px-1 min-w-8 h-8 flex items-center justify-center text-white font-bold text-sm rounded-md ${getPositionColor(position)}`}
    >
      {position}
    </div>
  );
};

export default PositionBadge;
