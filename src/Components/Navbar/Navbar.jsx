import React from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import { FaUser , FaUsers ,FaHome } from "react-icons/fa";
import { IoMenu, IoNotifications } from "react-icons/io5";
import { IoPerson } from "react-icons/io5"; 

const Navbar = () => {


  return (
    <div className='navbar'>
        <div className="nav-left">
            <IoMenu onClick={() => {document.querySelector('.nav-center').classList.toggle('mobile-menu-active')}} size={40} className='menu-icon' />
            <h1 className='logo'>MPL</h1>
        </div>
        
        <nav className='nav-center'>
            <ul className='nav-links' onClick={() => {document.querySelector('.nav-center').classList.remove('mobile-menu-active')}}>
                <li><NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><FaHome size ="20px" className='icon'/> Home</NavLink></li>
                <li><NavLink to='/matches' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Matches</NavLink></li>
                <li><NavLink to='/teams' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><FaUsers size="20px" className='icon'/> Teams</NavLink></li>
                <li><NavLink to='/pointstable' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>PointsTable</NavLink></li>
                <li><NavLink to='/players' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Players</NavLink></li>
                <li><NavLink to='/auction' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Auction</NavLink></li>
                <li><NavLink to='/gallery' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Gallery</NavLink></li>
                <li><NavLink to='/stats' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Stats</NavLink></li>
                <li><NavLink to='/sponsors' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Sponsors</NavLink></li>
            </ul>
        </nav>
        <div className="nav-end">
            <button className ='notify-icon'><IoNotifications size="20px" /></button>
            <button className='login-btn'><IoPerson size="20px" color='black' className='icon'/> Login</button>
        </div>

    </div>
  )
}

export default Navbar
