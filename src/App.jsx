import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layout";
import DashboardPage from "./pages/dashboard";
import PlayersPage from "./pages/players";
import NotFound from "./pages/not-found";
import UsersPage from "./pages/users";
import UserPlayers from "./pages/user-players";
import { TournamentProvider } from "./context/TournamentContext"; // Import the provider
import Matches from "./pages/matches";
import MatchDetailsPage from "./pages/match-details";
import PlayerDetails from "./pages/player-details";
import TeamStats from "./pages/stats";
import TeamWiseStatsPage from "./pages/team-stats";
import GoalsPage from "./pages/goals";

function App() {
  return (
    <TournamentProvider> {/* ✅ Wrap the entire app with context */}
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/:tournamentId/:playerId" element={<PlayerDetails />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId/:tournamentId/players" element={<UserPlayers />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:tournamentId/:id" element={<MatchDetailsPage />} />
            <Route path="/stats" element={<TeamStats />} />
            <Route path="*" element={<NotFound />} /> {/* ✅ Catch-all for undefined routes */}
            <Route path="/stats/:tournamentId/:teamId" element={<TeamWiseStatsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TournamentProvider>
  );
}

export default App;
