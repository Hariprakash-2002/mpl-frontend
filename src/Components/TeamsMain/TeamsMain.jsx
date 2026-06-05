import React from 'react'
import './TeamsMain.css'
import team_bg from '../../assets/team_bg.png'
import logo from '../../assets/hero_logo.png'
import AllTeams from './AllTeams/AllTeams'

const TeamsMain = () => {
  return (
    <div 
      className='teams-main' 
      style={{ backgroundImage: `linear-gradient(135deg, rgba(2, 8, 23, 0.85) 0%, rgba(4, 16, 45, 0.9) 100%), url(${team_bg})` }}
    >
      {/* Header section consistent with page layout specifications */}
      <div className="team-heading">
        <img src={logo} alt="Hero Logo" className="hero-logo-img" />
        <h1>Tournament <span className="highlight">Teams</span></h1>
        <p>Meet the franchises participating in the championship</p>
        {/* delete this */}
        <p>Players will be updated correctly after <span className="highlight">Auction</span></p>
        <hr width="11.5%" color="#FFD54F" />
      </div>
      
      <div className="main-content">
        <AllTeams className="all-teams" />
      </div>
    </div>
  )
}

export default TeamsMain