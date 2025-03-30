import { createContext, useContext, useState } from "react"

const TournamentContext = createContext()

export function TournamentProvider({ children }) {
  const [selectedTournament, setSelectedTournament] = useState(null)

  return (
    <TournamentContext.Provider value={{ selectedTournament, setSelectedTournament }}>
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournament() {
  return useContext(TournamentContext)
}
