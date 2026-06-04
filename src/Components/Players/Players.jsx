import React, { useState } from 'react'
import './Players.css'
import { useQuery } from '@tanstack/react-query'
import { FaCrown,FaBaseballBall ,FaSearch, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { GiCricketBat } from 'react-icons/gi'
import { RiShieldUserLine } from 'react-icons/ri'

import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'

// Map your existing team names to the color classes established in Auction.css
const TEAM_CLASSES = {
  'NG Boys': 'team-mumbai',
  'Best Friends': 'team-kolkata',
  'Fire Boys': 'team-delhi',
}

const mockPlayersData = [
  {
    teamId: 1,
    teamName: 'NG Boys',
    logo: Ng_Logo,
    pool: 'A',
    captainId: 1,
    players: [
      { id: 1, name: 'Praveen Kumar', role: 'Batsman', isCaptain: true, jerseyNumber: 45 },
      { id: 2, name: 'Gokul', role: 'Bowler', isCaptain: false, jerseyNumber: 93 },
      { id: 3, name: 'Arul', role: 'Batsman', isCaptain: false, jerseyNumber: 63 },
      { id: 4, name: 'Gowtham', role: 'All-Rounder', isCaptain: false, jerseyNumber: 7 },
      { id: 5, name: 'Nirmal Kumar', role: 'Wicket-Keeper', isCaptain: false, jerseyNumber: 18 },
      { id: 6, name: 'Arun Babu', role: 'Batsman', isCaptain: false, jerseyNumber: 77 },
      { id: 7, name: 'Dinesh Babu', role: 'Wicket-Keeper', isCaptain: false, jerseyNumber: 23 },
      { id: 8, name: 'Suriya', role: 'All-Rounder', isCaptain: false, jerseyNumber: 12 },
    ]
  },
  {
    teamId: 2,
    teamName: 'Best Friends',
    logo: BG_Logo,
    pool: 'A',
    captainId: 9,
    players: [
      { id: 9, name: 'Rishabh Pant', role: 'Wicket-Keeper', isCaptain: true, jerseyNumber: 17 },
      { id: 10, name: 'Axar Patel', role: 'All-Rounder', isCaptain: false, jerseyNumber: 38 },
      { id: 11, name: 'Prithvi Shaw', role: 'Batsman', isCaptain: false, jerseyNumber: 3 },
      { id: 12, name: 'David Warner', role: 'Batsman', isCaptain: false, jerseyNumber: 31 },
      { id: 13, name: 'Khaleel Ahmed', role: 'Bowler', isCaptain: false, jerseyNumber: 19 },
      { id: 14, name: 'Sarfaraz Khan', role: 'Batsman', isCaptain: false, jerseyNumber: 8 },
      { id: 15, name: 'Ashwin Hebbar', role: 'All-Rounder', isCaptain: false, jerseyNumber: 24 },
    ]
  },
  {
    teamId: 3,
    teamName: 'Fire Boys',
    logo: FB_Logo,
    pool: 'B',
    captainId: 16,
    players: [
      { id: 16, name: 'Virat Kohli', role: 'Batsman', isCaptain: true, jerseyNumber: 18 },
      { id: 17, name: 'Jasprit Bumrah', role: 'Bowler', isCaptain: false, jerseyNumber: 93 },
      { id: 18, name: 'Mohammed Siraj', role: 'Bowler', isCaptain: false, jerseyNumber: 13 },
      { id: 19, name: 'Glenn Maxwell', role: 'All-Rounder', isCaptain: false, jerseyNumber: 32 },
      { id: 20, name: 'Dinesh Karthik', role: 'Wicket-Keeper', isCaptain: false, jerseyNumber: 7 },
      { id: 21, name: 'Tilak Varma', role: 'Batsman', isCaptain: false, jerseyNumber: 51 },
    ]
  },
]

const groupPlayersByRole = (players) => {
  const roles = ['Captain', 'Batsman', 'Wicket-Keeper', 'Bowler', 'All-Rounder']
  const grouped = {}
  
  roles.forEach(role => {
    grouped[role] = players.filter(p => 
      role === 'Captain' ? p.isCaptain : p.role === role && !p.isCaptain
    )
  })
  
  return grouped
}

const Players = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // React Query setup matching standard database structures
  const { data: teamsData = mockPlayersData } = useQuery({
    queryKey: ['playersData'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/teams/roster')
      if (!response.ok) throw new Error('Database offline')
      return response.json()
    },
    initialData: mockPlayersData,
    retry: false
  })

  const handleTeamSelect = (team) => {
    setSelectedTeam(selectedTeam?.teamId === team.teamId ? null : team)
  }

  // Live filter based on user searches
  const filteredTeams = teamsData.map(team => {
    const matchingPlayers = team.players.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return { ...team, players: matchingPlayers }
  }).filter(team => team.players.length > 0)

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Batsman': return <GiCricketBat />
      case 'Bowler': return <FaBaseballBall />
      case 'Wicket-Keeper': return <RiShieldUserLine />
      default: return <FaUser />
    }
  }

  return (
    <div className='players-page'>
      {/* Header section consistent with page architecture */}
      <div className='players-header'>
        <span className="subtitle">MPL Players</span>
        <h1>Tournament <span className="highlight">Rosters</span></h1>
        <p>Meet the talented athletes representing their teams</p>
        <div className='header-line'></div>
      </div>

      {/* Global Interactive Search Bar */}
      <div className="players-search-container">
        <div className="players-search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search players by name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Roster lists matching accordion card styling rules */}
      <div className='teams-roster'>
        {filteredTeams.map((team) => {
          const groupedPlayers = groupPlayersByRole(team.players)
          const isExpanded = selectedTeam?.teamId === team.teamId
          const teamColorClass = TEAM_CLASSES[team.teamName] || ''

          return (
            <div key={team.teamId} className={`team-roster-card ${teamColorClass}`}>
              <div 
                className='team-roster-header'
                onClick={() => handleTeamSelect(team)}
              >
                <div className='team-info'>
                  <img src={team.logo} alt={team.teamName} className='team-logo' />
                  <div className='team-text'>
                    <h2>{team.teamName}</h2>
                    <span className={`pool-badge pool-${team.pool.toLowerCase()}`}>Pool {team.pool}</span>
                  </div>
                </div>
                <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {isExpanded && (
                <div className='team-roster-content'>
                  {/* Captain Section (Prominent gold/amber spotlight card) */}
                  {groupedPlayers['Captain'] && groupedPlayers['Captain'].length > 0 && (
                    <div className='role-section'>
                      <div className='role-header'>
                        <span className='role-badge captain-badge'><FaCrown /> Captain</span>
                        <span className='player-count'>({groupedPlayers['Captain'].length})</span>
                      </div>
                      <div className='players-grid captain-grid'>
                        {groupedPlayers['Captain'].map((player) => (
                          <div key={player.id} className='player-card captain-card'>
                            <div className='player-avatar'>
                              <span className='jersey-number'>{player.jerseyNumber}</span>
                            </div>
                            <div className='player-info'>
                              <h4>{player.name}</h4>
                              <p className='player-role'>{player.role}</p>
                            </div>
                            <div className='captain-badge-small'>C</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard position grids */}
                  {['Wicket-Keeper', 'Batsman', 'All-Rounder', 'Bowler'].map((role) => (
                    groupedPlayers[role] && groupedPlayers[role].length > 0 && (
                      <div key={role} className='role-section'>
                        <div className='role-header'>
                          <span className='role-badge'>
                            {getRoleIcon(role)} {role}
                          </span>
                          <span className='player-count'>({groupedPlayers[role].length})</span>
                        </div>
                        <div className='players-grid'>
                          {groupedPlayers[role].map((player) => (
                            <div key={player.id} className='player-card'>
                              <div className='player-avatar'>
                                <span className='jersey-number'>{player.jerseyNumber}</span>
                              </div>
                              <div className='player-info'>
                                <h4>{player.name}</h4>
                                <p className='player-role'>{player.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}

                  {/* Roster Metrics Summary */}
                  <div className='roster-stats'>
                    <div className='stat'>
                      <span className='stat-label'>Total Players</span>
                      <span className='stat-value'>{team.players.length}</span>
                    </div>
                    <div className='stat'>
                      <span className='stat-label'>Batsmen</span>
                      <span className='stat-value'>{groupedPlayers['Batsman']?.length || 0}</span>
                    </div>
                    <div className='stat'>
                      <span className='stat-label'>Bowlers</span>
                      <span className='stat-value'>{groupedPlayers['Bowler']?.length || 0}</span>
                    </div>
                    <div className='stat'>
                      <span className='stat-label'>All-Rounders</span>
                      <span className='stat-value'>{groupedPlayers['All-Rounder']?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Players