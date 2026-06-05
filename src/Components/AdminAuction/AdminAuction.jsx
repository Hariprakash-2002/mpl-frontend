import React, { useState, useEffect } from 'react'
import './AdminAuction.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import { 
  FaTrophy, 
  FaCoins, 
  FaCrown, 
  FaDatabase, 
  FaFileExcel, 
  FaCheckCircle,
  FaUserMinus,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowAltCircleRight,
  FaLock
} from 'react-icons/fa'
import { RiShieldUserLine } from 'react-icons/ri'

import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'

const INITIAL_PURSE = 100000; 

const TEAMS_CONFIG = {
  'NG Boys': { logo: Ng_Logo },
  'Best Friends': { logo: BG_Logo },
  'Pepsi Boys': { logo: PB_Logo },
  'Fire Boys': { logo: FB_Logo },
}

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

const savePlayerUpdateToDb = async ({ payload, token }) => {
  const res = await fetch(`${API_BASE_URL}/player/update-player`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (res.status === 401) throw new Error("Unauthorized Token. Please re-login.");
  if (!res.ok) throw new Error("Failed to save changes.");
  return res.json();
};

const nominateUpcomingInDb = async ({ playerId, token }) => {
  const res = await fetch(`${API_BASE_URL}/player/set-upcoming/${playerId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (res.status === 401) throw new Error("Unauthorized Token. Please re-login.");
  if (!res.ok) throw new Error("Failed to nominate player.");
  return res.json();
};

const uploadCSVFileToDb = async ({ file, token }) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/player/upload-csv`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  if (res.status === 401) throw new Error("Unauthorized Token. Please re-login.");
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || "CSV parsing error.");
  }
  return res.text();
};

const getStatus = (player) => player.status || player.auctionStatus || 'Unprocessed';
const getPrice = (player) => player.soldPrice !== undefined ? player.soldPrice : (player.auctionPrice !== undefined ? player.auctionPrice : 0);

const AdminAuction = () => {
  const queryClient = useQueryClient();
  const [showDrawer, setShowDrawer] = useState(false);

  // Authentication State
  const [adminToken, setAdminToken] = useState(sessionStorage.getItem("admin_auth_token") || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Core Form States
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [playerSearchText, setPlayerSearchText] = useState(''); 
  const [auctionStatus, setAuctionStatus] = useState('Sold');
  const [selectedBuyerTeam, setSelectedBuyerTeam] = useState('');
  const [finalSoldPrice, setFinalSoldPrice] = useState('');

  // Global Table Search State
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // 1. Fetch live teams
  const { data: dbTeams, isLoading: isTeamsLoading, isError: isTeamsError } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeamsFromDb,
    refetchInterval: 2000, // 2 seconds for the admin
    staleTime: 1000,
    retry: true
  });

  // 2. Fetch live players
  const { data: dbPlayers, isLoading: isPlayersLoading, isError: isPlayersError } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayersFromDb,
    refetchInterval: 2000, // 2 seconds for the admin
    staleTime: 1000,
    retry: true
  });

  // EventSource Stream connection for pushed updates
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/player/stream`);

    eventSource.addEventListener("auction_update", () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    });

    eventSource.onerror = () => {
      console.warn("SSE stream dropped. Re-establishing...");
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  // Update Player Mutation
  const updateMutation = useMutation({
    mutationFn: savePlayerUpdateToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      setSelectedPlayerId('');
      setPlayerSearchText('');
      setFinalSoldPrice('');
      setSelectedBuyerTeam('');
      setLoginError('');
      alert("Database synced and broadcasted live!");
    },
    onError: (err) => {
      alert("Error saving: " + err.message);
      if (err.message.includes("Unauthorized")) {
        handleLogout();
      }
    }
  });

  // Set Nominated Player Mutation
  const nominateMutation = useMutation({
    mutationFn: nominateUpcomingInDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      alert("Upcoming next player nominated successfully!");
    },
    onError: (err) => {
      alert("Error: " + err.message);
      if (err.message.includes("Unauthorized")) {
        handleLogout();
      }
    }
  });

  // Bulk CSV Upload Mutation
  const csvUploadMutation = useMutation({
    mutationFn: uploadCSVFileToDb,
    onSuccess: (responseMessage) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      setShowDrawer(false);
      alert(responseMessage);
    },
    onError: (err) => {
      alert("Import Failed: " + err.message);
      if (err.message.includes("Unauthorized")) {
        handleLogout();
      }
    }
  });

  // auto-loads upcoming nominated player
  useEffect(() => {
    if (dbPlayers && dbPlayers.length > 0 && !selectedPlayerId && !playerSearchText) {
      const currentUpcoming = dbPlayers.find(p => getStatus(p).toLowerCase() === 'upcoming');
      if (currentUpcoming) {
        setSelectedPlayerId(currentUpcoming.id);
        setPlayerSearchText(currentUpcoming.playerName);
      }
    }
  }, [dbPlayers, selectedPlayerId, playerSearchText]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === "yourSecretPassword123") {
      sessionStorage.setItem("admin_auth_token", passwordInput.trim());
      setAdminToken(passwordInput.trim());
      setLoginError("");
    } else {
      setLoginError("Incorrect Admin Token. Access Refused.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth_token");
    setAdminToken("");
    setPasswordInput("");
  };

  const handleCSVUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      csvUploadMutation.mutate({ file, token: adminToken });
    }
  };

  if (!adminToken) {
    return (
      <div className="admin-login-fullscreen">
        <div className="login-card">
          <div className="lock-icon-container"><FaLock /></div>
          <h2>MPL Auction Access</h2>
          <p>Please enter your secure access token below to authorize operations.</p>
          <form onSubmit={handleLoginSubmit}>
            <input 
              type="password" 
              placeholder="Authorization Key..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            {loginError && <span className="login-error-msg">{loginError}</span>}
            <button type="submit" className="login-submit-btn">Authorize Node</button>
          </form>
        </div>
      </div>
    );
  }

  if (isPlayersLoading || isTeamsLoading) {
    return (
      <div className="admin-auction-container fallback-state">
        <FaSpinner className="fallback-spinner" />
        <h2>Syncing Admin Dashboard...</h2>
        <p>Awaiting live connection stream from server...</p>
      </div>
    );
  }

  if (isPlayersError || isTeamsError || !dbPlayers || !dbTeams) {
    return (
      <div className="admin-auction-container fallback-state error-state">
        <FaExclamationTriangle className="fallback-error-icon" />
        <h2>Database Server Offline</h2>
        <p>The admin database is unreachable. Retrying automatically...</p>
      </div>
    );
  }

  const activeTeams = dbTeams;
  const activePlayers = dbPlayers;

  const totalPlayersCount = activePlayers.length;
  const soldCount = activePlayers.filter(p => getStatus(p) === 'Sold' || getStatus(p).toLowerCase() === 'retained').length;
  const unsoldCount = activePlayers.filter(p => getStatus(p) === 'Unsold').length;

  const formatMoney = (value) => {
    if (value >= 100000) return `${(value / 100000)} L`;
    if (value >= 1000) return `${(value / 1000)} K`;
    return `₹${value}`;
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setPlayerSearchText(value);

    const matchedPlayer = activePlayers.find(
      p => p.playerName.toLowerCase() === value.trim().toLowerCase()
    );

    if (matchedPlayer) {
      setSelectedPlayerId(matchedPlayer.id);
    } else {
      setSelectedPlayerId(''); 
    }
  };

  const handleSelectFromTable = (player) => {
    setSelectedPlayerId(player.id);
    setPlayerSearchText(player.playerName);

    const formElement = document.querySelector('.live-player-controller-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNominateNext = () => {
    if (!selectedPlayerId) {
      alert("Please select a player to nominate first.");
      return;
    }
    nominateMutation.mutate({ playerId: selectedPlayerId, token: adminToken });
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedPlayerId) {
      alert("Please select a valid player first.");
      return;
    }

    const targetPlayer = activePlayers.find(p => p.id === Number(selectedPlayerId));
    if (!targetPlayer) {
      alert("Player not found.");
      return;
    }
    
    const payload = {
      id: targetPlayer.id,
      status: auctionStatus,
      buyerTeam: auctionStatus === 'Sold' ? selectedBuyerTeam : 'None',
      soldPrice: auctionStatus === 'Sold' ? Number(finalSoldPrice) : 0
    };

    updateMutation.mutate({ payload, token: adminToken });
  };

  const filteredTablePlayers = activePlayers.filter(p => 
    p.playerName?.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
    p.role?.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
    getStatus(p).toLowerCase().includes(tableSearchQuery.toLowerCase())
  );

  return (
    <div className="admin-auction-container">
      <div className="admin-header">
        <div className="admin-branding">
          <h1>MPL Auction Panel</h1>
          <p>Update player purchase status, track budgets, and manage draft rosters</p>
        </div>
        <div className="admin-quick-header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="header-action-btn" onClick={() => setShowDrawer(true)}>
            <FaDatabase /> Emergency Options
          </button>
          <button className="logout-btn" onClick={handleLogout}>Lock Board</button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-box-admin">
          <FaTrophy className="stat-admin-icon gold-glow" />
          <div>
            <span className="stat-admin-label">Total Draft Pool</span>
            <h3>{totalPlayersCount} Players</h3>
          </div>
        </div>
        <div className="stat-box-admin">
          <FaCoins className="stat-admin-icon cyan-glow" />
          <div>
            <span className="stat-admin-label">Players Sold</span>
            <h3>{soldCount} Sold</h3>
          </div>
        </div>
        <div className="stat-box-admin">
          <RiShieldUserLine className="stat-admin-icon orange-glow" />
          <div>
            <span className="stat-admin-label">Passed Pool</span>
            <h3>{unsoldCount} Unsold</h3>
          </div>
        </div>
      </div>

      <div className="admin-console-grid">
        
        <div className="admin-column-main">
          <div className="live-player-controller-card">
            <div className="card-header-badge">
              <FaCrown color="#FFD54F" />
              <h3>Update Player Purchase Status</h3>
            </div>

            <form onSubmit={handleSaveUpdate} className="admin-manual-update-form">
              <div className="form-row">
                <label>Select Active Player</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    list="players-datalist"
                    placeholder="Search by typing player name..." 
                    value={playerSearchText}
                    onChange={handleSearchInputChange}
                    required
                    style={{ paddingRight: '35px' }}
                  />
                  <FaSearch style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
                </div>

                <datalist id="players-datalist">
                  {activePlayers.map(p => (
                    <option key={p.id} value={p.playerName}>
                      {p.role} ({getStatus(p)})
                    </option>
                  ))}
                </datalist>

                {selectedPlayerId ? (
                  <span style={{ fontSize: '0.8rem', color: '#00E5FF', marginTop: '4px', display: 'block' }}>
                    ✓ Match Found (ID: {selectedPlayerId}) {getStatus(activePlayers.find(p => p.id === selectedPlayerId)) === 'Upcoming' && " [Nominated Next]"}
                  </span>
                ) : playerSearchText ? (
                  <span style={{ fontSize: '0.8rem', color: '#ff6b6b', marginTop: '4px', display: 'block' }}>
                    ⚠ Select a valid player from the list.
                  </span>
                ) : null}
              </div>

              <div className="form-row">
                <label>Draft Status</label>
                <select 
                  value={auctionStatus} 
                  onChange={(e) => setAuctionStatus(e.target.value)}
                >
                  <option value="Sold">SOLD</option>
                  <option value="Retained">RETAINED</option>
                  <option value="Unsold">UNSOLD</option>
                  <option value="Unprocessed">UNPROCESSED</option>
                </select>
              </div>

              {(auctionStatus === 'Sold' || auctionStatus === 'Retained') && (
                <>
                  <div className="form-row">
                    <label>Buyer Franchise</label>
                    <select 
                      value={selectedBuyerTeam} 
                      onChange={(e) => setSelectedBuyerTeam(e.target.value)} 
                      required
                    >
                      <option value="">-- Choose Team --</option>
                      {activeTeams.map(t => (
                        <option key={t.id || t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <label>Sold Price (INR)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000" 
                      value={finalSoldPrice} 
                      onChange={(e) => setFinalSoldPrice(e.target.value)} 
                      required
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="save-update-btn"
                  disabled={!selectedPlayerId || updateMutation.isPending}
                  style={{ flex: 2, opacity: selectedPlayerId ? 1 : 0.6, cursor: selectedPlayerId ? 'pointer' : 'not-allowed' }}
                >
                  {updateMutation.isPending ? "Syncing..." : "Save & Sync Status"}
                </button>

                <button 
                  type="button" 
                  onClick={handleNominateNext}
                  className="nominate-next-btn"
                  disabled={!selectedPlayerId || nominateMutation.isPending}
                  style={{ 
                    flex: 1, 
                    opacity: selectedPlayerId ? 1 : 0.6, 
                    cursor: selectedPlayerId ? 'pointer' : 'not-allowed',
                    backgroundColor: '#e67e22',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {nominateMutation.isPending ? "Syncing..." : "Nominate Next"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-column-sidebar">
          <div className="upcoming-queue-card">
            <div className="card-header-badge">
              <RiShieldUserLine color="#00E5FF" />
              <h3>Franchise Budgets & Roster</h3>
            </div>
            
            <div className="teams-vertical-budget-list">
              {activeTeams.map((team) => {
                const teamPlayersList = activePlayers.filter(p => 
                  p.buyerTeam && 
                  p.buyerTeam.toLowerCase() === team.name?.toLowerCase() &&
                  (getStatus(p).toLowerCase() === 'sold' || getStatus(p).toLowerCase() === 'retained')
                );

                const dynamicSpent = teamPlayersList.reduce((sum, p) => sum + getPrice(p), 0);
                const remainingPurse = INITIAL_PURSE - dynamicSpent;

                return (
                  <div key={team.id || team.name} className="mini-budget-card">
                    <div className="mini-budget-card-header">
                      <img src={TEAMS_CONFIG[team.name]?.logo || team.logoUrl || team.logo} alt="" className="budget-team-logo" />
                      <div>
                        <h4>{team.name}</h4>
                        <span>Spent: <strong>{formatMoney(dynamicSpent)}</strong></span>
                      </div>
                    </div>
                    
                    <div className="mini-budget-roster-subgroup">
                      <div className="roster-list-title">Bought ({teamPlayersList.length}):</div>
                      {teamPlayersList.length > 0 ? (
                        <div className="mini-player-bullet-grid">
                          {teamPlayersList.map(player => (
                            <span key={player.id} className="player-bullet">
                              • {player.playerName} {getStatus(player).toLowerCase() === 'retained' && "👑"} <span className="mini-text">({formatMoney(getPrice(player))})</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-squad-text"><FaUserMinus /> Empty Squad</span>
                      )}
                    </div>

                    <div className="mini-budget-values">
                      <span>Left: <strong className="green-accent">{formatMoney(remainingPurse)}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      <div className="admin-team-budgets-section">
        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h2>All Registered Players</h2>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              placeholder="Filter table by name, status..." 
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              style={{ paddingLeft: '35px', borderRadius: '20px' }}
            />
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          </div>
        </div>

        <div className="unsold-accordion-card registered-database-card">
          <div className="table-responsive-wrapper">
            <table className="registered-players-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Base Price</th>
                  <th>Auction Status</th>
                  <th>Buyer / Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTablePlayers.map((player) => {
                  const pStatus = getStatus(player);
                  return (
                    <tr key={player.id} className={`db-row status-${pStatus.toLowerCase()}`}>
                      <td>
                        <strong>{player.playerName}</strong>
                        <span className="db-nationality-span">{player.role || 'Player'} | {player.nationality || 'India'}</span>
                      </td>
                      <td>{formatMoney(player.basePrice)}</td>
                      <td>
                        <span className={`db-status-badge badge-${pStatus.toLowerCase()}`}>
                          {pStatus}
                        </span>
                      </td>
                      <td>
                        {pStatus === 'Sold' ? (
                          <div className="db-sold-info">
                            <span className="db-buyer-abbr">{player.buyerTeam}</span>
                            <strong className="db-sold-price">{formatMoney(getPrice(player))}</strong>
                          </div>
                        ) : (
                          <span className="base-price-label">N/A</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            type="button"
                            onClick={() => handleSelectFromTable(player)}
                            style={{
                              backgroundColor: selectedPlayerId === player.id ? '#00E5FF' : '#2b3b4f',
                              color: selectedPlayerId === player.id ? '#000' : '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            }}
                          >
                            {selectedPlayerId === player.id ? 'Selected' : 'Select'}
                          </button>

                          {(pStatus === 'Unprocessed' || pStatus === 'Unsold') && (
                            <button 
                              type="button"
                              onClick={() => nominateMutation.mutate({ playerId: player.id, token: adminToken })}
                              style={{
                                backgroundColor: '#e67e22',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                              }}
                            >
                              Set Next
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDrawer && (
        <div className="emergency-overlay">
          <div className="emergency-panel-card">
            <div className="drawer-header">
              <h3>SYSTEM CONTROL PANEL</h3>
              <button className="close-drawer-btn" onClick={() => setShowDrawer(false)}>×</button>
            </div>
            <div className="drawer-body">
              <p className="drawer-alert-text">Use these parameters to override database constraints during discrepancies.</p>
              
              <div className="emergency-action-group">
                <h4>Upload Team to Database</h4>
                <button className="emergency-btn excel-upload-btn">
                  <FaFileExcel />
                  <NavLink to='/createteam' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Team Upload </NavLink>
                </button>
              </div>

              <div className="emergency-action-group">
                <h4>Batch Player CSV Upload</h4>
                <div className="file-upload-input-wrapper">
                  <input 
                    type="file" 
                    accept=".csv" 
                    id="csv-file-selector" 
                    onChange={handleCSVUploadChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="csv-file-selector" className="emergency-btn excel-upload-btn" style={{ cursor: 'pointer' }}>
                    <FaFileExcel /> Select and Upload CSV File
                  </label>
                </div>
                {csvUploadMutation.isPending && <span className="upload-loading-text">Parsing and uploading players...</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAuction