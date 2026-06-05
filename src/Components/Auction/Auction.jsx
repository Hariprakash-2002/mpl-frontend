import React, { useState, useEffect } from 'react'
import './Auction.css'
import { useQuery, useQueryClient } from '@tanstack/react-query' 
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
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCrown
} from 'react-icons/fa'
import { GiCricketBat, GiGavel } from 'react-icons/gi'
import { RiShieldUserLine } from 'react-icons/ri'

// Team logos imported from your assets folder as fallbacks
import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'
import Rain_Logo from '../../assets/Rainbow_logo.png'
import SBCC_Logo from '../../assets/SBCC_logo.png'
import SB_Logo from '../../assets/Spark_Boys_logo.png'
import TSM_Logo from '../../assets/Top_Star_logo.png'
import VM_Logo from '../../assets/Vallarasu_Memorial_logo.png'
import Y11s_Logo from '../../assets/Youngs_11_logo.png'
import Kalai_Logo from '../../assets/Kalaipoonga_logo.png'
import LCC_Logo from '../../assets/LCC_logo.png'

const INITIAL_PURSE = 100000; 


// ('NG Boys', NULL, 0.0),
// ('Best Friends', NULL, 0.0),
// ('Pepsi Boys', NULL, 0.0),
// ('Fire Boys', NULL, 0.0),
// ('LCC', NULL, 0.0),
// ('Top Star', NULL, 0.0),
// ('Rainbow', NULL, 0.0),
// ('Young 11', NULL, 0.0),
// ('SBCC', NULL, 0.0),
// ('Vallarasu Memorial', NULL, 0.0),
// ('Kalaipoonga', NULL, 0.0),
// ('Spark Boys', NULL, 0.0)
// ;

// UI style map matching database team names to their UI classes and local assets
const TEAM_STYLE_MAP = {
  'ng boys': { abbr: 'NG', logo: Ng_Logo, colorClass: 'team-mumbai' },
  'best friends': { abbr: 'BF', logo: BG_Logo, colorClass: 'team-kolkata' },
  'pepsi boys': { abbr: 'PB', logo: PB_Logo, colorClass: 'team-delhi' },
  'fire boys': { abbr: 'FB', logo: FB_Logo, colorClass: 'team-fb' },
  'rainbow': { abbr: 'RB', logo: Rain_Logo, colorClass: 'team-rc' },
  'sbcc': { abbr: 'SBCC', logo: SBCC_Logo, colorClass: 'team-sbcc' },
  'spark boys': { abbr: 'SB', logo: SB_Logo, colorClass: 'team-spark' },
  'top star': { abbr: 'TSM', logo: TSM_Logo, colorClass: 'team-tsm' },
  'vallarasu memorial': { abbr: 'VM', logo: VM_Logo, colorClass: 'team-vm' },
  'young 11': { abbr: 'Y11', logo: Y11s_Logo, colorClass: 'team-y11' },
  'kalaipoonga': { abbr: 'KP', logo: Kalai_Logo, colorClass: 'team-kalai' },
  'lcc': { abbr: 'LCC', logo: LCC_Logo, colorClass: 'team-lcc' },
};




const API_BASE_URL = "https://mpl-backend-cibq.onrender.com";

const fetchTeamsFromDb = async () => {
  const res = await fetch(`${API_BASE_URL}/team/all`);
  if (!res.ok) throw new Error("Database offline");
  return res.json();
};

const fetchPlayersFromDb = async () => {
  const res = await fetch(`${API_BASE_URL}/player/all`);
  if (!res.ok) throw new Error("Database offline");
  return res.json();
};

const formatPurse = (value) => {
  if (value >= 100000) {
    return `${(value / 100000)} L`
  }
  return `${(value / 1000)} K`
}

// Normalized getters to safely handle database naming variations
const getStatus = (player) => player.auctionStatus || player.status || 'Unprocessed';
const getPrice = (player) => player.auctionPrice !== undefined ? player.auctionPrice : (player.soldPrice !== undefined ? player.soldPrice : 0);

const Auction = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('')
  const [showFullLog, setShowFullLog] = useState(false)
  const [expandedTeams, setExpandedTeams] = useState({
    'NG Boys': true, 
    'Registered': false,   
  })
  const [expandedPlayers, setExpandedPlayers] = useState({})

  // EventSource Stream connection for pushed updates
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/player/stream`);

    eventSource.addEventListener("auction_update", () => {
      // Refresh cache instantly when a change is made
      queryClient.invalidateQueries({ queryKey: ['liveAuctionPlayers'] });
      queryClient.invalidateQueries({ queryKey: ['liveAuctionTeams'] });
    });

    eventSource.onerror = () => {
      console.warn("SSE disconnected. Reconnecting automatically...");
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  // Read data with static cache (SSE invalidates this automatically)
  const { data: dbPlayers, isLoading: isPlayersLoading, isError: isPlayersError } = useQuery({
    queryKey: ['liveAuctionPlayers'],
    queryFn: fetchPlayersFromDb,
    refetchInterval: 10000, // 10 seconds interval for public users
    staleTime: 5000, 
    retry: true
  });

  const { data: dbTeams, isLoading: isTeamsLoading, isError: isTeamsError } = useQuery({
    queryKey: ['liveAuctionTeams'],
    queryFn: fetchTeamsFromDb,
    refetchInterval: 10000, // 10 seconds interval for public users
    staleTime: 5000, 
    retry: true
  });


  if (isPlayersLoading || isTeamsLoading) {
    return (
      <div className="auction-page-fallback-state">
        <FaSpinner className="fallback-spinner" />
        <h2>Connecting to Live Stream...</h2>
        <p>Awaiting live connection stream from server...</p>
      </div>
    );
  }

  if (isPlayersError || isTeamsError || !dbPlayers || !dbTeams) {
    return (
      <div className="auction-page-fallback-state error-state">
        <FaExclamationTriangle className="fallback-error-icon" />
        <h2>Live Server Offline</h2>
        <p>The host database server at ${API_BASE_URL} is unreachable. Retrying...</p>
      </div>
    );
  }

  const activePlayers = dbPlayers;
  const activeTeams = dbTeams;

  const toggleTeam = (teamName) => {
    setExpandedTeams((prev) => ({ ...prev, [teamName]: !prev[teamName] }))
  }

  const togglePlayer = (playerId) => {
    setExpandedPlayers((prev) => ({ ...prev, [playerId]: !prev[playerId] }))
  }

  const getTeamStyle = (teamName) => {
    const key = teamName?.toLowerCase().trim();
    return TEAM_STYLE_MAP[key] || { 
      abbr: teamName?.substring(0, 3).toUpperCase() || 'TM', 
      logo: null, 
      colorClass: 'team-default' 
    };
  };

  const getTeamLogo = (teamName) => {
    const matchedDbTeam = activeTeams.find(t => t.name?.toLowerCase() === teamName?.toLowerCase());
    if (matchedDbTeam && matchedDbTeam.logoUrl) {
      return matchedDbTeam.logoUrl;
    }
    return getTeamStyle(teamName).logo;
  };

 const soldPlayers = activePlayers.filter((item) => getStatus(item) === 'Sold' || getStatus(item).toLowerCase() === 'retained')
  const unsoldPlayers = activePlayers.filter((item) => getStatus(item) === 'Unsold')
  const highestBidValue = Math.max(...soldPlayers.map((item) => getPrice(item)), 0)

  const sortedChronologicalLog = [...activePlayers].sort((a, b) => b.id - a.id)
  const latestSoldPlayer = soldPlayers[soldPlayers.length - 1]
  const nextPlayer = activePlayers.find((item) => getStatus(item) === 'Upcoming')

  const teamMetrics = activeTeams.reduce((acc, team) => {
    const teamName = team.name;
    const playersBought = soldPlayers.filter(
      (p) => p.buyerTeam && p.buyerTeam.toLowerCase() === teamName.toLowerCase()
    );
    
    const dynamicSpent = playersBought.reduce((sum, p) => sum + getPrice(p), 0);
    const spentValue = dynamicSpent > 0 ? dynamicSpent : (team.spent || 0);

    acc[teamName] = {
      playersCount: playersBought.length,
      spent: spentValue,
      remaining: INITIAL_PURSE - spentValue,
      otherPanchayatCount: playersBought.filter((p) => p.nationality && p.nationality.toLowerCase().trim() !== 'murungapatti').length,
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
      <div className="auction-header">
        <div className="header-branding">
          <span className="subtitle">Tournament Live Center</span>
          <h1>Mega Auction Purchases</h1>
          <p>Track real-time squad acquisitions, calculated remaining salary caps, and role divisions.</p>
        </div>

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

      <div className="dual-banners-container">
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
                  {getTeamLogo(latestSoldPlayer.buyerTeam) && (
                    <img src={getTeamLogo(latestSoldPlayer.buyerTeam)} alt="" className="ticker-team-logo" />
                  )}
                  <span className="ticker-team-name">{latestSoldPlayer.buyerTeam}</span>
                  <span className="ticker-price">{formatPurse(getPrice(latestSoldPlayer))}</span>
                </div>
              </div>
            </div>
            <button className="view-log-btn" onClick={() => setShowFullLog(!showFullLog)}>
              <FaHistory /> {showFullLog ? 'Hide History' : 'View Full Log'}
            </button>
          </div>
        ) : (
          <div className="live-ticker-banner empty-ticker">No transactions recorded yet.</div>
        )}

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

      {showFullLog && (
        <div className="full-log-panel">
          <div className="log-panel-header">
            <h3>Chronological Auction History</h3>
            <span className="total-sold-count">{activePlayers.length} entries on file</span>
          </div>
          <div className="log-timeline-wrapper">
            {sortedChronologicalLog.map((player) => {
              const pStatus = getStatus(player);
              return (
                <div key={player.id} className="log-timeline-row">
                  <div className="log-player-meta">
                    <strong>{player.playerName}</strong>
                    <span className="log-role-pill">{player.role}</span>
                  </div>
                  <div className="log-status-action">
                    {pStatus === 'Sold' ? (
                      <div className="log-sold-details">
                        <span className="arrow-indicator">→</span>
                        <span className="bought-by">Acquired by</span>
                        {getTeamLogo(player.buyerTeam) && (
                          <img src={getTeamLogo(player.buyerTeam)} alt="" className="mini-log-logo" />
                        )}
                        <span className="log-buyer-name">{player.buyerTeam}</span>
                        <strong className="log-final-price">{formatPurse(getPrice(player))}</strong>
                      </div>
                    ) : pStatus === 'Upcoming' ? (
                      <span className="log-upcoming-badge">Upcoming</span>
                    ) : (
                      <span className="log-unsold-badge">Unsold</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {searchQuery.trim() !== '' ? (
        <section className="search-results-section">
          <div className="section-title">
            <h2>Search Results ({filteredSearchList.length})</h2>
          </div>
          {filteredSearchList.length > 0 ? (
            <div className="results-list">
              {filteredSearchList.map((player) => {
                const pStatus = getStatus(player);
                return (
                  <div key={player.id} className="search-player-card">
                    <div className="player-summary-row" onClick={() => togglePlayer(player.id)}>
                      <div className="player-id-name">
                        <h3>{player.playerName}</h3>
                        <span className="role-pill">{player.role}</span>
                      </div>
                      <div className="player-summary-bids">
                        {pStatus === 'Sold' ? (
                          <span className="final-price-tag">{formatPurse(getPrice(player))}</span>
                        ) : pStatus === 'Upcoming' ? (
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
                        {pStatus === 'Sold' && (
                          <div className="buyer-team-meta">
                            <span>Acquired by: <strong>{player.buyerTeam}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results-state">
              <p>No matches found in database. Try typing another name.</p>
            </div>
          )}
        </section>
      ) : (
        <div className="team-squads-container">
          {activeTeams.map((team) => {
            const teamName = team.name;
            const style = getTeamStyle(teamName);
            const metrics = teamMetrics[teamName] || {
              playersCount: 0,
              spent: team.spent || 0,
              remaining: INITIAL_PURSE - (team.spent || 0),
              foreignCount: 0,
              players: []
            };
            const isOpen = expandedTeams[teamName]

            const groupedPlayers = {
              'Batsman': metrics.players.filter((p) => p.role === 'Batsman'),
              'Wicket-Keeper': metrics.players.filter((p) => p.role === 'Wicket-Keeper'),
              'All-Rounder': metrics.players.filter((p) => p.role === 'All-Rounder'),
              'Bowler': metrics.players.filter((p) => p.role === 'Bowler'),
            }

            const teamLogo = getTeamLogo(teamName);

            return (
              <div key={team.id || teamName} className={`team-accordion-card ${style.colorClass}`}>
                <div className="accordion-header" onClick={() => toggleTeam(teamName)}>
                  <div className="team-identity">
                    {teamLogo ? (
                      <img src={teamLogo} alt={teamName} className="team-badge-logo" />
                    ) : (
                      <div className="unsold-placeholder-logo">🛡️</div>
                    )}
                    <div>
                      <h2>{teamName} ({style.abbr})</h2>
                      <div className="header-meta-chips">
                        <span>Squad: <strong>{metrics.playersCount}</strong></span>
                        <span style={{ color: metrics.otherPanchayatCount > 2 ? '#ff6b6b' : 'inherit' }}>
                          Ext. Panchayat: <strong style={{ textDecoration: metrics.otherPanchayatCount > 2 ? 'underline' : 'none' }}>{metrics.otherPanchayatCount}/2</strong>
                        </span>
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
                                    <div className="player-row-main" onClick={() => togglePlayer(player.id)}>
                                      <div className="player-name-section">
                                        <h4>
                                          {player.playerName}
                                          {getStatus(player).toLowerCase() === 'retained' && (
                                            <FaCrown className="retained-player-crown" title="Retained Player" />
                                          )}
                                        </h4>
                                        <span className="nationality-indicator">
                                          {player.nationality} {player.nationality && player.nationality.toLowerCase().trim() !== 'murungapatti' && '📍 (Ext)'}
                                        </span>
                                      </div>
                                      <div className="player-pricing-section">
                                        <span className="row-price">{formatPurse(getPrice(player))}</span>
                                        {isPlayerOpen ? <FaChevronUp /> : <FaChevronDown />}
                                      </div>
                                    </div>

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
                      {activePlayers.map((player) => {
                        const pStatus = getStatus(player);
                        return (
                          <tr key={player.id} className={`db-row status-${pStatus.toLowerCase()}`}>
                            <td className="db-player-cell">
                              <strong>{player.playerName}</strong>
                              <span className="db-nationality-span">{player.nationality} {player.nationality !== 'Murungapatti' && '✈️'}</span>
                            </td>
                            <td className="db-role-cell">
                              <span className="role-pill">{player.role}</span>
                            </td>
                            <td>{formatPurse(player.basePrice)}</td>
                            <td className="db-status-cell">
                              {pStatus === 'Sold' ? (
                                <div className="db-sold-info">
                                  <span className="db-sold-badge">SOLD</span>
                                  <span className="db-buyer-abbr">
                                    {getTeamStyle(player.buyerTeam)?.abbr}
                                  </span>
                                  <span className="db-sold-price">
                                    {formatPurse(getPrice(player))}
                                  </span>
                                </div>
                              ) : pStatus === 'Upcoming' ? (
                                <span className="db-status-badge badge-upcoming">NEXT</span>
                              ) : (
                                <span className="db-status-badge badge-passed">PASSED</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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