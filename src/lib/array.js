export function sortArray(array, key) {
    return array.slice().sort((a, b) => a[key].localeCompare(b[key]));
}

export function sortPlayersByPosition(players) {
    const positionOrder = [
        "GK", "RB", "RWB", "CB", "LB", "LWB",
        "CDM", "CM", "CAM", "RM", "LM",
        "RW", "LW", "ST"
    ];

    return players
        .slice()
        .sort((a, b) => {
            const posA = positionOrder.indexOf(a.position);
            const posB = positionOrder.indexOf(b.position);

            if (posA === -1 && posB === -1) {
                return a.name.localeCompare(b.name); // Sort unknown positions alphabetically
            } else if (posA === -1) {
                return 1; // Unknown positions go at the end
            } else if (posB === -1) {
                return -1; // Known positions come first
            }

            if (posA !== posB) {
                return posA - posB; // Sort by position order
            }

            // If positions are the same, sort alphabetically by name
            return a.name.localeCompare(b.name);
        });
}
