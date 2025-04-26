import { useState, useEffect } from "react";
import CustomSelect from "../../components/select";
import CustomInput from "../../components/input";

const SubstitutionModal = ({ teamDetails, onConfirm }) => {
    const [substitutions, setSubstitutions] = useState([{ subOff: null, subOn: null, time: "" }]);
    const [updatedPlayers, setUpdatedPlayers] = useState(teamDetails.players);
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        const isComplete = substitutions.every(sub => sub.subOff && sub.subOn && sub.time !== "");
        setCanSubmit(isComplete);
    }, [substitutions]);

    const handleAddSubstitution = () => {
        setSubstitutions([...substitutions, { subOff: null, subOn: null, time: "" }]);
    };

    const handleSubChange = (index, field, value) => {
        const newSubs = [...substitutions];
        newSubs[index][field] = value;
        setSubstitutions(newSubs);
    };

    const handleConfirm = () => {
        let updated = [...updatedPlayers];

        substitutions.forEach((sub) => {
            if (sub.subOff && sub.subOn && sub.time) {
                const subOffIndex = updated.findIndex(p => p._id === sub.subOff);
                const subOnIndex = updated.findIndex(p => p._id === sub.subOn);

                if (subOffIndex !== -1) {
                    updated[subOffIndex] = {
                        ...updated[subOffIndex],
                        endTime: parseInt(sub.time),
                        totalPlayTime: parseInt(sub.time) - updated[subOffIndex].startTime,
                    };
                }

                if (subOnIndex !== -1) {
                    updated[subOnIndex] = {
                        ...updated[subOnIndex],
                        playingStatus: true,
                        startTime: parseInt(sub.time),
                        endTime: 90,
                        totalPlayTime: 90 - parseInt(sub.time),
                    };
                }
            }
        });

        setUpdatedPlayers(updated);
        onConfirm({ name: teamDetails.name, players: updated });
    };

    const isAllowedBooking = (status) => status === "none" || status === "yellow";

    const subOffOptions = updatedPlayers
        .filter(player =>
            player.playingStatus &&
            player.endTime === 90 &&
            isAllowedBooking(player.bookingStatus)
        )
        .map(player => ({ label: player.name, value: player._id }));

    const subOnOptions = updatedPlayers
        .filter(player =>
            !player.playingStatus &&
            isAllowedBooking(player.bookingStatus)
        )
        .map(player => ({ label: player.name, value: player._id }));

    const getPlayerStartTime = (playerId) => {
        const player = updatedPlayers.find(p => p._id === playerId);
        return player ? player.startTime : null;
    };

    return (
        <div className="flex flex-col gap-4 p-6  rounded-md shadow-md bg-white max-h-[70vh] overflow-y-scroll">
            <h2 className="text-lg font-bold mb-4 bg-white rounded-md p-2">Substitutions for {teamDetails.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {substitutions.map((sub, index) => (
                    <div key={index} className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50">
                        <div className="flex-1">
                            <CustomSelect
                                label="Sub Off"
                                data={subOffOptions}
                                config={{ key: "value", label: "label" }}
                                onSelect={(option) => handleSubChange(index, "subOff", option?.value)}
                            />
                            {sub.subOff && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Start Time: {getPlayerStartTime(sub.subOff)}'
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <CustomSelect
                                label="Sub On"
                                data={subOnOptions}
                                config={{ key: "value", label: "label" }}
                                onSelect={(option) => handleSubChange(index, "subOn", option?.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <CustomInput
                                label="Substitution Time (minutes)"
                                type="number"
                                value={sub.time}
                                onChange={(e) => handleSubChange(index, "time", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    className={`px-4 py-2 rounded text-white ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={handleAddSubstitution}
                    disabled={!canSubmit}
                >
                    Add Substitution
                </button>
                <button
                    className={`px-4 py-2 rounded text-white ${canSubmit ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={handleConfirm}
                    disabled={!canSubmit}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default SubstitutionModal;
