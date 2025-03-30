import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { FaBars, FaChartPie, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { RiTeamLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom'
import { IoFootballOutline } from "react-icons/io5";
import { IoIosStats } from "react-icons/io";

const SidebarComponent = () => {
    const navigate = useNavigate();
    // State to manage collapsed sidebar
    const [collapsed, setCollapsed] = useState(false)

    // Toggle function for the hamburger button
    const toggleSidebar = () => {
        setCollapsed(prev => !prev)
    }

    // Menu items JSON data
    const menuItems = [
        { type: 'menuitem', label: 'Dashboard', icon: <MdOutlineSpaceDashboard fontSize={25} />, path: '/' },
        { type: 'menuitem', label: 'Users', icon: <LuUsers fontSize={25} />, path: '/users' },
        { type: 'menuitem', label: 'Matches', icon: <IoFootballOutline fontSize={25} />, path: '/matches' },
        { type: 'menuitem', label: 'Players', icon: <RiTeamLine fontSize={25} />, path: '/players' },
        { type: 'menuitem', label: 'Statistics', icon: <IoIosStats fontSize={25} />, path: '/stats' },
    ]

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar collapsed={collapsed}>
                {/* Hamburger button to toggle sidebar */}
                <div
                    style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={toggleSidebar}
                >
                    <FaBars size={20} />

                </div>

                {/* Render menu dynamically from JSON */}
                <Menu>
                    {menuItems.map((item, index) => {
                        if (item.type === 'submenu') {
                            return (
                                <SubMenu key={index} label={item.label} icon={item.icon}>
                                    {item.items.map((subItem, subIndex) => (
                                        <MenuItem key={subIndex}>
                                            {subItem.label}
                                            <Link to={subItem.path} />
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            )
                        } else if (item.type === 'menuitem') {
                            return (
                                <MenuItem key={index} icon={item.icon} onClick={()=> navigate(item.path)}>
                                    {item.label}
                                </MenuItem>
                            )
                        }
                        return null
                    })}
                </Menu>
            </Sidebar>
        </div>
    )
}

export default SidebarComponent
