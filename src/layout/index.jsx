// src/layouts/MainLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import SidebarComponent from '../components/Sidebar'
import 'react-confirm-alert/src/react-confirm-alert.css';

const MainLayout = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex space-x-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/players" className="hover:underline">Players</Link>
        </nav>
      </header>
      <main className="flex">
        <SidebarComponent />
        <div className='p-4 w-full min-h-screen bg-slate-100 m-0'><Outlet /></div>

      </main>
    </div>
  )
}

export default MainLayout
