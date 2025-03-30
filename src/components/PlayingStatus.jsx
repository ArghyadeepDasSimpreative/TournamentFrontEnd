import { FaExclamationTriangle } from "react-icons/fa";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { MdOutlineSportsSoccer } from "react-icons/md";

const PlayingStatus = ({ status }) => {
  if (status === "yes") return null; // Do not render anything for "yes"

  const statusConfig = {
    "double-yellow": { color: "bg-yellow-500", icon: <MdOutlineSportsSoccer /> },
    "red": { color: "bg-red-500", icon: <IoMdClose /> },
    "yellow": { color: "bg-yellow-300", icon: <FaExclamationTriangle /> },
    "injured": { color: "bg-gray-500", icon: <IoMdCheckmark /> },
  };

  const config = statusConfig[status] || { color: "bg-gray-300", icon: <IoMdCheckmark /> };

  return (
    <div className={`absolute top-4 right-4 w-6 h-7 flex items-center justify-center rounded-md text-white ${config.color}`}>
      {config.icon}
    </div>
  );
};

export default PlayingStatus;
