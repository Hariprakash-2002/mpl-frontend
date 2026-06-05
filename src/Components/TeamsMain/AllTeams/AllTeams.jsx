import React, { useState } from 'react'
import './AllTeams.css'
import { FaUser, FaUsers, FaCrown, FaTrophy } from "react-icons/fa"
import { RiShieldUserLine } from "react-icons/ri"

// Team logos imported from your existing assets folder
import Ng_Logo from '../../../assets/NG_Boys_logo.png'
import BG_Logo from '../../../assets/Best_Friends_logo.png'
import FB_Logo from '../../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../../assets/Pepsi_logo.png'
import Rain_Logo from '../../../assets/Rainbow_logo.png'
import SBCC_Logo from '../../../assets/SBCC_logo.png'
import SB_Logo from '../../../assets/Spark_Boys_logo.png'
import TSM_Logo from '../../../assets/Top_Star_logo.png'
import VM_Logo from '../../../assets/Vallarasu_Memorial_logo.png'
import Y11s_Logo from '../../../assets/Youngs_11_logo.png'
import Kalai_Logo from '../../../assets/Kalaipoonga_logo.png'
import LCC_Logo from '../../../assets/LCC_logo.png'

const AllTeams = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)

  const teams = [
    { id: 1, pool: 'Pool A', logo: Ng_Logo, team: 'NG Boys', captainName: "Praveen Kumar", likes: 2 },
    { id: 2, pool: 'Pool A', logo: BG_Logo, team: 'Best Friends', captainName: "Sivaraj", likes: 3 },
    { id: 3, pool: 'Pool A', logo: FB_Logo, team: 'Fireboys', captainName: "Prakash", likes: 1 },
    { id: 4, pool: 'Pool A', logo: Kalai_Logo, team: 'Kalaipoonga', captainName: "Karthik", likes: 4 },
    { id: 5, pool: 'Pool A', logo: LCC_Logo, team: 'LCC Boys', captainName: "Thangam", likes: 0 },
    { id: 6, pool: 'Pool A', logo: PB_Logo, team: 'Pepsi Boys', captainName: "Prakash PT", likes: 5 },

    { id: 7, pool: 'Pool B', logo: Rain_Logo, team: 'Rainbow', captainName: "Vadivazhagan", likes: 2 },
    { id: 8, pool: 'Pool B', logo: SBCC_Logo, team: 'SBCC', captainName: "Murugan", likes: 3 },
    { id: 9, pool: 'Pool B', logo: SB_Logo, team: 'Spark Boys', captainName: "Srinivasan", likes: 1 },
    { id: 10, pool: 'Pool B', logo: TSM_Logo, team: 'Top Star Murungapatti', captainName: "Saravana Kumar", likes: 4 },
    { id: 11, pool: 'Pool B', logo: VM_Logo, team: 'Vallarasu Memorial', captainName: "Arivazhagan", likes: 0 },
    { id: 12, pool: 'Pool B', logo: Y11s_Logo, team: 'Young 11s', captainName: "Santhosh", likes: 5 },
  ];

  // Map players dynamically based on team context
  const getPlayersForTeam = (teamId) => {
    switch (teamId) {
      case 1:
        return [
          { id: 1, name: "Praveen Kumar", role: "Captain" },
          { id: 2, name: "Dinesh Babu", role: "Vice Captain" },
          { id: 3, name: "Arun Babu", role: "Batsman" },
          { id: 4, name: "Nirmal Kumar", role: "Wicket Keeper" },
          { id: 5, name: "Gowtham", role: "All-Rounder" },
          { id: 6, name: "Arul", role: "Batsman" },
          { id: 7, name: "Gokul", role: "Bowler" },
          { id: 8, name: "Suriya", role: "Bowler" }
        ];
      case 2:
        return [
          { id: 1, name: "Sivaraj", role: "Captain" },
          { id: 2, name: "Karthi", role: "Batsman" },
          { id: 3, name: "Velu", role: "All-Rounder" },
          { id: 4, name: "Raja", role: "Bowler" },
          { id: 5, name: "Satish", role: "Bowler" }
        ];
      case 3:
        return [
          { id: 1, name: "Prakash", role: "Captain" },
          { id: 2, name: "Vijay", role: "Batsman" },
          { id: 3, name: "Surya", role: "Wicket Keeper" },
          { id: 4, name: "Dinesh", role: "Bowler" },
          { id: 5, name: "Ajay", role: "All-Rounder" }
        ];
      default:
        return [
          { id: 1, name: "Captain Name", role: "Captain" },
          { id: 2, name: "Player Two", role: "Vice Captain" },
          { id: 3, name: "Player Three", role: "Batsman" },
          { id: 4, name: "Player Four", role: "All-Rounder" },
          { id: 5, name: "Player Five", role: "Bowler" },
        ];
    }
  }

  const selectedTeamPlayers = selectedTeam ? getPlayersForTeam(selectedTeam.id) : [];

  return (
    <div className="all-teams">
      {/* Team Sidebar (Splits dynamically by Pool A and Pool B) */}
      <div className="team-list">
        <div className="pool-section">
          <span className="pool-header-title">Pool A</span>
          {teams.filter(t => t.pool === 'Pool A').map((team) => (
            <div 
              className={`team-card ${selectedTeam?.id === team.id ? 'active-team' : ''}`} 
              key={team.id}
              onClick={() => setSelectedTeam(team)}
            >
              <button className="team-btn">
                <img src={team.logo} alt={`${team.team} logo`} className="mini-logo" /> 
                <span>{team.team}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="pool-section">
          <span className="pool-header-title">Pool B</span>
          {teams.filter(t => t.pool === 'Pool B').map((team) => (
            <div 
              className={`team-card ${selectedTeam?.id === team.id ? 'active-team' : ''}`} 
              key={team.id}
              onClick={() => setSelectedTeam(team)}
            >
              <button className="team-btn">
                <img src={team.logo} alt={`${team.team} logo`} className="mini-logo" /> 
                <span>{team.team}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Team Details Panel */}
      <div className="single-team-info">
        {selectedTeam ? (
          <div className="team-info-card">
            <div className="selected-team-info">
              <div className="team-logo">
                <img src={selectedTeam.logo} alt={`${selectedTeam.team} logo`} className="focus-logo" />
              </div>
              <div className="team-title">
                <h2>{selectedTeam.team}</h2>
                <div className="captain-tag">
                  <FaCrown color="#FFD54F" /> 
                  <p><span>Captain:</span> {selectedTeam.captainName}</p>
                </div>
                <span className="pool-badge">{selectedTeam.pool}</span>
              </div>
            </div>

            <div className="players-lable">
              <FaUsers size={20} color="#FFD54F" />
              <h3>Roster ({selectedTeamPlayers.length} Players)</h3>
            </div>

            {/* <div className="players-cards-container">
              {selectedTeamPlayers.map((player) => (
                <div key={player.id} className={`player-card-profile ${player.role === 'Captain' ? 'captain-row' : ''}`}>
                  <div className="player-badge">
                    {player.role === 'Captain' ? <FaCrown color="#FFD54F" /> : <FaUser color="rgba(255,255,255,0.4)" />}
                  </div>
                  <div className="player-text-block">
                    <h4>{player.name}</h4>
                    <span className="player-pos-tag">{player.role}</span>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        ) : (
          <div className="empty-selection-state">
            <RiShieldUserLine size={64} className="shield-placeholder" />
            <h2>Team Directory</h2>
            <p>Select a franchise from the directory list to load rosters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllTeams