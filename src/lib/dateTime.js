export function formatCustomDate(dateString) {
    const date = new Date(dateString);
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });

    // Function to get the ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (num) => {
        if (num > 3 && num < 21) return "th";
        switch (num % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}, ${weekday}`;
}
