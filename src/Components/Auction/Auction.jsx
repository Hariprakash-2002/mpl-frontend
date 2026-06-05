import React, { useState } from 'react'
import './Auction.css'
import { useQuery } from '@tanstack/react-query' // <-- React Query Integration
import { 
  FaTrophy, 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaUser, 
  FaGlobe, 
  FaCoins, 
  FaBaseballBall,
  FaHistory,
  FaCalendarAlt
} from 'react-icons/fa'
import { GiCricketBat, GiGavel } from 'react-icons/gi'
import { RiShieldUserLine } from 'react-icons/ri'

// Team logos imported from your assets folder
import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'

const INITIAL_PURSE = 100000; 

const TEAMS_CONFIG = {
  'NG Boys': { abbr: 'NG', logo: Ng_Logo, colorClass: 'team-mumbai' },
  'Best Friends': { abbr: 'BF', logo: BG_Logo, colorClass: 'team-kolkata' },
  'Pepsi Boys': { abbr: 'PB', logo: PB_Logo, colorClass: 'team-delhi' },
  'Fire Boys': { abbr: 'FB', logo: FB_Logo, colorClass: 'team-rc' },
}

const fetchPlayersFromDb = async () => {
  const res = await fetch("https://mpl-backend-cibq.onrender.com/player/all");
  if (!res.ok) throw new Error("Database offline");
  return res.json();
};

const formatPurse = (value) => {
  if (value >= 100000) {
    return `${(value / 100000)} L`
  }
  return `${(value / 1000)} K`
}

const Auction = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFullLog, setShowFullLog] = useState(false)
  const [expandedTeams, setExpandedTeams] = useState({
    'Mumbai Masters': true, 
    'Registered': false,   
  })
  const [expandedPlayers, setExpandedPlayers] = useState({})

  // Local fallback players list used automatically if Spring Boot is offline
  const localFallbackPlayers = [
    { id: 1, playerName: 'Sakthivel', role: 'Batsman', jersey: 18, nationality: 'India', age: 37, buyerTeam: 'NG Boys', auctionStatus: 'Sold', auctionPrice: 24000, basePrice: 20000 },
    { id: 2, playerName: 'Prathap', role: 'Bowler', jersey: 93, nationality: 'India', age: 32, buyerTeam: 'Best Friends', auctionStatus: 'Sold', auctionPrice: 18000, basePrice: 15000 },
    { id: 3, playerName: 'Vadivazhagan', role: 'All-Rounder', jersey: 33, nationality: 'India', age: 32, buyerTeam: 'Pepsi Boys', auctionStatus: 'Sold', auctionPrice: 16000, basePrice: 12000 },
    { id: 4, playerName: 'Mani Barathi', role: 'Wicket-Keeper', jersey: 12, nationality: 'South Africa', age: 33, buyerTeam: 'Fire Boys', auctionStatus: 'Sold', auctionPrice: 14000, basePrice: 12000 },
    { id: 5, playerName: 'Gowtham', role: 'Batsman', jersey: 63, nationality: 'Australia', age: 35, buyerTeam: 'NG Boys', auctionStatus: 'Sold', auctionPrice: 15000, basePrice: 10000 },
    { id: 6, playerName: 'Praveen Kumar', role: 'Bowler', jersey: 56, nationality: 'India', age: 36, buyerTeam: 'Unsold', auctionStatus: 'Unsold', auctionPrice: 0, basePrice: 20000 },
    { id: 7, playerName: 'Suriya', role: 'Bowler', jersey: 19, nationality: 'Afghanistan', age: 27, buyerTeam: 'Unsold', auctionStatus: 'Upcoming', auctionPrice: 0, basePrice: 15000 }
  ];

  // Retrieve players from MySQL, updating the UI in real-time
  const { data: dbPlayers = [], isLoading, error } = useQuery({
    queryKey: ['liveAuctionPlayers'],
    queryFn: fetchPlayersFromDb,
    refetchInterval: 1000, // Poll database every 1 second [2]
    staleTime: 500,
    retry: false
  });

  const toggleTeam = (teamName) => {
    setExpandedTeams((prev) => ({ ...prev, [teamName]: !prev[teamName] }))
  }

  const togglePlayer = (playerId) => {
    setExpandedPlayers((prev) => ({ ...prev, [playerId]: !prev[playerId] }))
  }

  const activePlayers = dbPlayers.length > 0 ? dbPlayers : localFallbackPlayers;

  const soldPlayers = activePlayers.filter((item) => item.auctionStatus === 'Sold')
  const unsoldPlayers = activePlayers.filter((item) => item.auctionStatus === 'Unsold')
  const highestBidValue = Math.max(...soldPlayers.map((item) => item.auctionPrice || 0), 0)

  // Chronological log
  const sortedChronologicalLog = [...activePlayers].sort((a, b) => b.id - a.id)

  // Last sold player
  const latestSoldPlayer = soldPlayers[soldPlayers.length - 1]

  // Upcoming designated player
  const nextPlayer = activePlayers.find((item) => item.auctionStatus === 'Upcoming')

  // Calculated team spent records
  const teamMetrics = Object.keys(TEAMS_CONFIG).reduce((acc, teamName) => {
    const playersBought = soldPlayers.filter((p) => p.buyerTeam === teamName)
    const totalSpent = playersBought.reduce((sum, p) => sum + (p.auctionPrice || 0), 0)
    const foreignCount = playersBought.filter((p) => p.nationality !== 'India').length

    acc[teamName] = {
      playersCount: playersBought.length,
      spent: totalSpent,
      remaining: INITIAL_PURSE - totalSpent,
      foreignCount: foreignCount,
      players: playersBought,
    }
    return acc
  }, {})

  const filteredSearchList = searchQuery.trim() !== ''
    ? activePlayers.filter((player) =>
        player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Batsman': return <GiCricketBat />
      case 'Bowler': return <FaBaseballBall /> 
      case 'Wicket-Keeper': return <RiShieldUserLine />
      default: return <FaUser />
    }
  }

  return (
    <div className="auction-page">
      {/* Top Section Header */}
      <div className="auction-header">
        <div className="header-branding">
          <span className="subtitle">Tournament Live Center</span>
          <h1>Mega Auction Purchases</h1>
          <p>
            Track real-time squad acquisitions, calculated remaining salary caps, and role divisions.
          </p>
        </div>

        {/* Global Dashboard Metrics */}
        <div className="header-stats">
          <div className="stat-card">
            <FaTrophy />
            <div>
              <span className="stat-label">Sold Players</span>
              <strong>{soldPlayers.length} / {activePlayers.length}</strong>
            </div>
          </div>
          <div className="stat-card">
            <FaCoins />
            <div>
              <span className="stat-label">Highest Auction Bid</span>
              <strong>{formatPurse(highestBidValue)}</strong>
            </div>
          </div>
          <div className="stat-card">
            <FaGlobe />
            <div>
              <span className="stat-label">Unsold Pool</span>
              <strong>{unsoldPlayers.length} Players</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Ticker Banner Wrapper */}
      <div className="dual-banners-container">
        {/* Banner 1: Real-time Ticker: Last Sold Player */}
        {latestSoldPlayer ? (
          <div className="live-ticker-banner">
            <div className="ticker-main-content">
              <div className="ticker-badge sold-ticker-badge">
                <span className="pulse-dot"></span>
                LATEST SOLD
              </div>
              <div className="ticker-body">
                <div className="ticker-player">
                  <strong>{latestSoldPlayer.playerName}</strong>
                  <span className="ticker-role">{latestSoldPlayer.role}</span>
                </div>
                <div className="ticker-deal">
                  <span className="sold-label">Sold to</span>
                  <img 
                    src={TEAMS_CONFIG[latestSoldPlayer.buyerTeam]?.logo} 
                    alt="" 
                    className="ticker-team-logo" 
                  />
                  <span className="ticker-team-name">{latestSoldPlayer.buyerTeam}</span>
                  <span className="ticker-price">{formatPurse(latestSoldPlayer.auctionPrice)}</span>
                </div>
              </div>
            </div>
            <button 
              className="view-log-btn" 
              onClick={() => setShowFullLog(!showFullLog)}
            >
              <FaHistory /> {showFullLog ? 'Hide History' : 'View Full Log'}
            </button>
          </div>
        ) : (
          <div className="live-ticker-banner empty-ticker">No transactions recorded yet.</div>
        )}

        {/* Banner 2: Next Player */}
        {nextPlayer ? (
          <div className="live-ticker-banner next-player-banner">
            <div className="ticker-main-content">
              <div className="ticker-badge upcoming-ticker-badge">
                <GiGavel className="gavel-icon" />
                UPCOMING NEXT
              </div>
              <div className="ticker-body">
                <div className="ticker-player">
                  <strong>{nextPlayer.playerName}</strong>
                  <span className="ticker-role">{nextPlayer.role} | {nextPlayer.nationality}</span>
                </div>
                <div className="ticker-deal">
                  <span className="sold-label">Base Price:</span>
                  <span className="ticker-price base-price-badge">{formatPurse(nextPlayer.basePrice)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="live-ticker-banner empty-ticker">No upcoming players left in the pool.</div>
        )}
      </div>

      {/* Expanded Chronological Live Log panel */}
      {showFullLog && (
        <div className="full-log-panel">
          <div className="log-panel-header">
            <h3>Chronological Auction History</h3>
            <span className="total-sold-count">{activePlayers.length} entries on file</span>
          </div>
          <div className="log-timeline-wrapper">
            {sortedChronologicalLog.map((player) => (
              <div key={player.id} className="log-timeline-row">
                <div className="log-player-meta">
                  <strong>{player.playerName}</strong>
                  <span className="log-role-pill">{player.role}</span>
                </div>
                <div className="log-status-action">
                  {player.auctionStatus === 'Sold' ? (
                    <div className="log-sold-details">
                      <span className="arrow-indicator">→</span>
                      <span className="bought-by">Acquired by</span>
                      <img 
                        src={TEAMS_CONFIG[player.buyerTeam]?.logo} 
                        alt="" 
                        className="mini-log-logo" 
                      />
                      <span className="log-buyer-name">{player.buyerTeam}</span>
                      <strong className="log-final-price">{formatPurse(player.auctionPrice)}</strong>
                    </div>
                  ) : player.auctionStatus === 'Upcoming' ? (
                    <span className="log-upcoming-badge">Upcoming</span>
                  ) : (
                    <span className="log-unsold-badge">Unsold</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Field */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search players by name, country, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Search results view */}
      {searchQuery.trim() !== '' ? (
        <section className="search-results-section">
          <div className="section-title">
            <h2>Search Results ({filteredSearchList.length})</h2>
          </div>
          {filteredSearchList.length > 0 ? (
            <div className="results-list">
              {filteredSearchList.map((player) => (
                <div key={player.id} className="search-player-card">
                  <div className="player-summary-row" onClick={() => togglePlayer(player.id)}>
                    <div className="player-id-name">
                      <h3>{player.playerName}</h3>
                      <span className="role-pill">{player.role}</span>
                    </div>
                    <div className="player-summary-bids">
                      {player.auctionStatus === 'Sold' ? (
                        <span className="final-price-tag">{formatPurse(player.auctionPrice)}</span>
                      ) : player.auctionStatus === 'Upcoming' ? (
                        <span className="upcoming-status-tag">Upcoming</span>
                      ) : (
                        <span className="unsold-status-tag">Unsold</span>
                      )}
                      {expandedPlayers[player.id] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>

                  {expandedPlayers[player.id] && (
                    <div className="player-nested-details">
                      <div className="nested-grid">
                        <div className="detail-item"><strong>Nationality:</strong> {player.nationality}</div>
                        <div className="detail-item"><strong>Age:</strong> {player.age}</div>
                        <div className="detail-item"><strong>Jersey:</strong> #{player.jersey}</div>
                        <div className="detail-item"><strong>Base Price:</strong> {formatPurse(player.basePrice)}</div>
                      </div>
                      {player.auctionStatus === 'Sold' && (
                        <div className="buyer-team-meta">
                          <span>Acquired by: <strong>{player.buyerTeam}</strong></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-state">
              <p>No matches found in database. Try typing another name.</p>
            </div>
          )}
        </section>
      ) : (
        /* Team Squad View */
        <div className="team-squads-container">
          {Object.keys(TEAMS_CONFIG).map((teamName) => {
            const config = TEAMS_CONFIG[teamName]
            const metrics = teamMetrics[teamName]
            const isOpen = expandedTeams[teamName]

            const groupedPlayers = {
              'Batsman': metrics.players.filter((p) => p.role === 'Batsman'),
              'Wicket-Keeper': metrics.players.filter((p) => p.role === 'Wicket-Keeper'),
              'All-Rounder': metrics.players.filter((p) => p.role === 'All-Rounder'),
              'Bowler': metrics.players.filter((p) => p.role === 'Bowler'),
            }

            return (
              <div key={teamName} className={`team-accordion-card ${config.colorClass}`}>
                {/* Collapsible Accordion Header */}
                <div className="accordion-header" onClick={() => toggleTeam(teamName)}>
                  <div className="team-identity">
                    <img src={config.logo} alt={teamName} className="team-badge-logo" />
                    <div>
                      <h2>{teamName} ({config.abbr})</h2>
                      <div className="header-meta-chips">
                        <span>Squad: <strong>{metrics.playersCount}</strong></span>
                        <span>Foreign: <strong>{metrics.foreignCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="team-purse-state">
                    <div className="purse-pill">
                      <span>Spent: <strong>{formatPurse(metrics.spent)}</strong></span>
                      <span>Left: <strong className="green-accent">{formatPurse(metrics.remaining)}</strong></span>
                    </div>
                    <div className="arrow-wrap">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion Body */}
                {isOpen && (
                  <div className="accordion-body">
                    {metrics.playersCount > 0 ? (
                      Object.keys(groupedPlayers).map((role) => {
                        const list = groupedPlayers[role]
                        if (list.length === 0) return null

                        return (
                          <div key={role} className="role-category-group">
                            <div className="role-subheading">
                              {getRoleIcon(role)}
                              <h3>{role.toUpperCase()}S ({list.length})</h3>
                            </div>

                            <div className="players-list-grid">
                              {list.map((player) => {
                                const isPlayerOpen = expandedPlayers[player.id]
                                return (
                                  <div key={player.id} className="player-row-card">
                                    <div 
                                      className="player-row-main"
                                      onClick={() => togglePlayer(player.id)}
                                    >
                                      <div className="player-name-section">
                                        <h4>{player.playerName}</h4>
                                        <span className="nationality-indicator">
                                          {player.nationality} {player.nationality !== 'India' && '✈️'}
                                        </span>
                                      </div>
                                      <div className="player-pricing-section">
                                        <span className="row-price">{formatPurse(player.auctionPrice)}</span>
                                        {isPlayerOpen ? <FaChevronUp /> : <FaChevronDown />}
                                      </div>
                                    </div>

                                    {/* Collapsible nested details block */}
                                    {isPlayerOpen && (
                                      <div className="player-nested-drawer">
                                        <div className="drawer-stats-grid">
                                          <div><strong>Base Price:</strong> {formatPurse(player.basePrice)}</div>
                                          <div><strong>Age:</strong> {player.age} Years</div>
                                          <div><strong>Jersey:</strong> #{player.jersey}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="empty-squad-state">
                        <p>No players acquired in the auction so far.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Unsold Players Section */}
          <div className="unsold-accordion-card">
            <div className="accordion-header" onClick={() => toggleTeam('Unsold')}>
              <div className="team-identity">
                <div className="unsold-placeholder-logo">⚠️</div>
                <div>
                  <h2>Unsold Player Pool</h2>
                  <div className="header-meta-chips">
                    <span>Total: <strong>{unsoldPlayers.length}</strong></span>
                  </div>
                </div>
              </div>
              <div className="arrow-wrap">
                {expandedTeams['Unsold'] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedTeams['Unsold'] && (
              <div className="accordion-body">
                {unsoldPlayers.length > 0 ? (
                  <div className="players-list-grid">
                    {unsoldPlayers.map((player) => (
                      <div key={player.id} className="player-row-card unsold-row">
                        <div className="player-row-main" onClick={() => togglePlayer(player.id)}>
                          <div className="player-name-section">
                            <h4>{player.playerName}</h4>
                            <span className="nationality-indicator">{player.role} | {player.nationality}</span>
                          </div>
                          <div className="player-pricing-section">
                            <span className="row-price base-price-label">Base: {formatPurse(player.basePrice)}</span>
                            {expandedPlayers[player.id] ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>

                        {expandedPlayers[player.id] && (
                          <div className="player-nested-drawer">
                            <div className="drawer-stats-grid">
                              <div><strong>Age:</strong> {player.age}</div>
                              <div><strong>Jersey:</strong> #{player.jersey}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-squad-state">
                    <p>No unsold players currently on record.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Collapsible Database of All Registered Players */}
          <div className="unsold-accordion-card registered-database-card">
            <div className="accordion-header" onClick={() => toggleTeam('Registered')}>
              <div className="team-identity">
                <div className="registered-placeholder-logo"><FaCalendarAlt /></div>
                <div>
                  <h2>All Registered Players</h2>
                  <div className="header-meta-chips">
                    <span>Database size: <strong>{activePlayers.length}</strong></span>
                  </div>
                </div>
              </div>
              <div className="arrow-wrap">
                {expandedTeams['Registered'] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedTeams['Registered'] && (
              <div className="accordion-body">
                <div className="table-responsive-wrapper">
                  <table className="registered-players-table">
                    <thead>
                      <tr>
                        <th>Player Details</th>
                        <th>Role</th>
                        <th>Base Price</th>
                        <th>Auction Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePlayers.map((player) => (
                        <tr 
                          key={player.id} 
                          className={`db-row status-${player.auctionStatus?.toLowerCase()}`}
                        >
                          <td className="db-player-cell">
                            <strong>{player.playerName}</strong>
                            <span className="db-nationality-span">{player.nationality} {player.nationality !== 'India' && '✈️'}</span>
                          </td>
                          <td className="db-role-cell">
                            <span className="role-pill">{player.role}</span>
                          </td>
                          <td>{formatPurse(player.basePrice)}</td>
                          <td className="db-status-cell">
                            {player.auctionStatus === 'Sold' ? (
                              <div className="db-sold-info">
                                <span className="db-sold-badge">SOLD</span>
                                <span className="db-buyer-abbr">
                                  {TEAMS_CONFIG[player.buyerTeam]?.abbr}
                                </span>
                                <span className="db-sold-price">
                                  {formatPurse(player.auctionPrice)}
                                </span>
                              </div>
                            ) : player.auctionStatus === 'Upcoming' ? (
                              <span className="db-status-badge badge-upcoming">NEXT</span>
                            ) : (
                              <span className="db-status-badge badge-passed">PASSED</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default Auction