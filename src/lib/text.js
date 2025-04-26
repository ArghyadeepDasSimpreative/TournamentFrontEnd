export function getShortenedName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length === 2) {
      // Example: Alex Jones -> A. Jones
      return `${parts[0][0]}. ${parts[1]}`;
    } else if (parts.length >= 3) {
      // Example: Alex David Jones -> A. David Jones
      return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
    } else {
      // If only one name is given, return it as is
      return fullName;
    }
  }
  