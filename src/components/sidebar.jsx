import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { FaBars } from 'react-icons/fa'
import { LuUsers } from "react-icons/lu"
import { MdOutlineSpaceDashboard } from "react-icons/md"
import { RiTeamLine } from "react-icons/ri"
import { IoFootballOutline } from "react-icons/io5"
import { IoIosStats } from "react-icons/io"
import { GiGoalKeeper } from "react-icons/gi";
import { useNavigate, useLocation } from 'react-router-dom'

const SidebarComponent = () => {
    const navigate = useNavigate()
    const location = useLocation() // Get the current route
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => {
        setCollapsed(prev => !prev)
    }

    const menuItems = [
        { label: 'Dashboard', icon: <MdOutlineSpaceDashboard fontSize={25} />, path: '/' },
        { label: 'Users', icon: <LuUsers fontSize={25} />, path: '/users' },
        { label: 'Matches', icon: <IoFootballOutline fontSize={25} />, path: '/matches' },
        { label: 'Players', icon: <RiTeamLine fontSize={25} />, path: '/players' },
        { label: 'Statistics', icon: <IoIosStats fontSize={25} />, path: '/stats' },
        { label: 'Goals', icon: <GiGoalKeeper fontSize={25} />, path: '/goals' }
    ]

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar collapsed={collapsed}>
                <div
                    style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={toggleSidebar}
                >
                    <FaBars size={20} />
                </div>

                <Menu>
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path // Check if the route is active
                        return (
                            <MenuItem
                                key={index}
                                icon={item.icon}
                                onClick={() => navigate(item.path)}
                                style={{
                                    backgroundColor: isActive ? '#2D2D2D' : 'transparent', // Dark gray near bg-gray-800
                                    color: isActive ? 'white' : 'inherit',
                                    borderRadius: '5px',
                                    margin: "0px 10px"
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        )
                    })}
                </Menu>
            </Sidebar>
        </div>
    )
}

export default SidebarComponent;
