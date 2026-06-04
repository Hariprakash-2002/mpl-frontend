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
  FaSearch
} from 'react-icons/fa'
import { RiShieldUserLine } from 'react-icons/ri'

// Brand team logos
import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'

const INITIAL_PURSE = 100000; 

// Local asset map for reliable team logo rendering
const TEAMS_CONFIG = {
  'NG Boys': { logo: Ng_Logo },
  'Best Friends': { logo: BG_Logo },
  'Pepsi Boys': { logo: PB_Logo },
  'Fire Boys': { logo: FB_Logo },
}

const fetchTeamsFromDb = async () => {
  const res = await fetch("http://localhost:8080/team/all");
  if (!res.ok) throw new Error("Database offline");
  return res.json();
};

const fetchPlayersFromDb = async () => {
  const res = await fetch("http://localhost:8080/player/all");
  if (!res.ok) throw new Error("Database offline");
  return res.json();
};

const savePlayerUpdateToDb = async (payload) => {
  const res = await fetch("http://localhost:8080/player/update-player", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update player status in database");
  return res.json();
};

const AdminAuction = () => {
  const queryClient = useQueryClient();
  const [showDrawer, setShowDrawer] = useState(false);

  // Core Form States
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [playerSearchText, setPlayerSearchText] = useState(''); 
  const [auctionStatus, setAuctionStatus] = useState('Sold');
  const [selectedBuyerTeam, setSelectedBuyerTeam] = useState('');
  const [finalSoldPrice, setFinalSoldPrice] = useState('');

  // Global Table Search State
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // 1. Fetch live teams
  const { data: dbTeams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeamsFromDb,
    staleTime: 1000 * 60,
    retry: false
  });

  // 2. Fetch live players
  const { data: dbPlayers = [] } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayersFromDb,
    staleTime: 1000 * 60,
    retry: false
  });

  // 3. React Query Mutation
  const updateMutation = useMutation({
    mutationFn: savePlayerUpdateToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      alert("Database synced and reloaded successfully!");
    },
    onError: (err) => {
      alert("Error: " + err.message);
    }
  });

  // Local fallbacks matching the simplified schema
  const localFallbackTeams = [
    { id: 1, name: 'Kalaipoonga', spent: 39000, logoUrl: PB_Logo },
    { id: 2, name: 'Vallarasu Memorial', spent: 18000, logoUrl: BG_Logo },
    { id: 3, name: 'Top Star', spent: 16000, logoUrl: FB_Logo },
    { id: 4, name: 'NG Boys', spent: 14000, logoUrl: Ng_Logo }
  ];

  const localFallbackPlayers = [
    { id: 1, playerName: 'Virat Kohli', role: 'Batsman', jersey: 18, nationality: 'India', age: 37, buyerTeam: 'NG Boys', status: 'Sold', soldPrice: 24000, basePrice: 20000 },
    { id: 2, playerName: 'Jasprit Bumrah', role: 'Bowler', jersey: 93, nationality: 'India', age: 32, buyerTeam: 'Best Friends', status: 'Sold', soldPrice: 18000, basePrice: 15000 },
    { id: 3, playerName: 'Hardik Pandya', role: 'All-Rounder', jersey: 33, nationality: 'India', age: 32, buyerTeam: 'Pepsi Boys', status: 'Sold', soldPrice: 16000, basePrice: 12000 },
    { id: 4, playerName: 'Quinton de Kock', role: 'Wicket-Keeper', jersey: 12, nationality: 'South Africa', age: 33, buyerTeam: 'Fire Boys', status: 'Sold', soldPrice: 14000, basePrice: 12000 },
    { id: 5, playerName: 'Suryakumar Yadav', role: 'Batsman', jersey: 63, nationality: 'India', age: 35, buyerTeam: 'None', status: 'Unprocessed', soldPrice: 0, basePrice: 10000 },
    { id: 6, playerName: 'Mitchell Starc', role: 'Bowler', jersey: 56, nationality: 'Australia', age: 36, buyerTeam: 'None', status: 'Unsold', soldPrice: 0, basePrice: 20000 }
  ];

  const activeTeams = dbTeams.length > 0 ? dbTeams : localFallbackTeams;
  const activePlayers = dbPlayers.length > 0 ? dbPlayers : localFallbackPlayers;

  const totalPlayersCount = activePlayers.length;
  const soldCount = activePlayers.filter(p => p.status === 'Sold').length;
  const unsoldCount = activePlayers.filter(p => p.status === 'Unsold').length;

  const formatMoney = (value) => {
    if (value >= 100000) return `${(value / 100000)} L`;
    if (value >= 10000) return `${(value / 1000)} K`;
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

  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedPlayerId) {
      alert("Please select a valid player from the dropdown list.");
      return;
    }

    const targetPlayer = activePlayers.find(p => p.id === Number(selectedPlayerId));
    if (!targetPlayer) {
      alert("Player not found in database.");
      return;
    }
    
    const payload = {
      id: targetPlayer.id,
      status: auctionStatus,
      buyerTeam: auctionStatus === 'Sold' ? selectedBuyerTeam : 'None',
      soldPrice: auctionStatus === 'Sold' ? Number(finalSoldPrice) : 0
    };

    updateMutation.mutate(payload);

    // Clean reset
    setSelectedPlayerId('');
    setPlayerSearchText('');
    setFinalSoldPrice('');
    setSelectedBuyerTeam('');
  };

 // Filter main table search
const filteredTablePlayers = activePlayers.filter(p => 
  p.playerName?.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
  p.role?.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
  p.status?.toLowerCase().includes(tableSearchQuery.toLowerCase())
);


    // For security purpose
    useEffect(() => {
  const isAuth = sessionStorage.getItem("admin_auth");
  if (isAuth !== "true") {
    const password = prompt("Enter Admin Password to Access:");
    if (password === "yourSecretPassword123") { // <-- Set your password here
      sessionStorage.setItem("admin_auth", "true");
    } else {
      alert("Access Denied!");
      window.location.href = "/"; // Redirects normal users back to home
    }
  }
}, []);



  return (
    <div className="admin-auction-container">
      {/* Header section */}
      <div className="admin-header">
        <div className="admin-branding">
          <h1>MPL Auction Panel</h1>
          <p>Update player purchase status, track budgets, and manage draft rosters</p>
        </div>
        <div className="admin-quick-header-actions">
          <button className="header-action-btn" onClick={() => setShowDrawer(true)}>
            <FaDatabase /> Emergency Options
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Main split grid */}
      <div className="admin-console-grid">
        
        {/* Left Column: Player Update Form */}
        <div className="admin-column-main">
          <div className="live-player-controller-card">
            <div className="card-header-badge">
              <FaCrown color="#FFD54F" />
              <h3>Update Player Purchase Status</h3>
            </div>

            <form onSubmit={handleSaveUpdate} className="admin-manual-update-form">
              
              {/* Autocomplete Input using Native HTML5 Datalist */}
              <div className="form-row">
                <label>Select Active Player (Search 200+ list)</label>
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
                      {p.role} ({p.status})
                    </option>
                  ))}
                </datalist>

                {selectedPlayerId ? (
                  <span style={{ fontSize: '0.8rem', color: '#00E5FF', marginTop: '4px', display: 'block' }}>
                    ✓ Match Found (ID: {selectedPlayerId})
                  </span>
                ) : playerSearchText ? (
                  <span style={{ fontSize: '0.8rem', color: '#ff6b6b', marginTop: '4px', display: 'block' }}>
                    ⚠ Keep typing or select a name from the list.
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
                  <option value="Unsold">UNSOLD</option>
                  <option value="Unprocessed">UNPROCESSED</option>
                </select>
              </div>

              {auctionStatus === 'Sold' && (
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

              <button 
                type="submit" 
                className="save-update-btn"
                disabled={!selectedPlayerId}
                style={{ opacity: selectedPlayerId ? 1 : 0.6, cursor: selectedPlayerId ? 'pointer' : 'not-allowed' }}
              >
                <FaCheckCircle /> Save & Sync Database
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Franchise Budget Dashboard */}
        <div className="admin-column-sidebar">
          <div className="upcoming-queue-card">
            <div className="card-header-badge">
              <RiShieldUserLine color="#00E5FF" />
              <h3>Franchise Budgets & Roster</h3>
            </div>
            
            <div className="teams-vertical-budget-list">
              {activeTeams.map((team) => {
                const teamPlayersList = activePlayers.filter(p => p.buyerTeam === team.name);

                return (
                  <div key={team.id || team.name} className="mini-budget-card">
                    <div className="mini-budget-card-header">
                      <img src={TEAMS_CONFIG[team.name]?.logo || team.logoUrl || team.logo} alt="" className="budget-team-logo" />
                      <div>
                        <h4>{team.name}</h4>
                        <span>Spent: <strong>{formatMoney(team.spent || 0)}</strong></span>
                      </div>
                    </div>
                    
                    <div className="mini-budget-roster-subgroup">
                      <div className="roster-list-title">Bought ({teamPlayersList.length}):</div>
                      {teamPlayersList.length > 0 ? (
                        <div className="mini-player-bullet-grid">
                          {teamPlayersList.map(player => (
                            <span key={player.id} className="player-bullet">
                              • {player.playerName} <span className="mini-text">({formatMoney(player.soldPrice)})</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-squad-text"><FaUserMinus /> Empty Squad</span>
                      )}
                    </div>

                    <div className="mini-budget-values">
                      <span>Left: <strong className="green-accent">{formatMoney(INITIAL_PURSE - (team.spent || 0))}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Interactive Roster Table */}
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTablePlayers.map((player) => (
                  <tr key={player.id} className={`db-row status-${player.status?.toLowerCase()}`}>
                    <td>
                      <strong>{player.playerName}</strong>
                      <span className="db-nationality-span">{player.role || 'Player'} | {player.nationality || 'India'}</span>
                    </td>
                    <td>{formatMoney(player.basePrice)}</td>
                    <td>
                      <span className={`db-status-badge badge-${player.status?.toLowerCase()}`}>
                        {player.status}
                      </span>
                    </td>
                    <td>
                      {player.status === 'Sold' ? (
                        <div className="db-sold-info">
                          <span className="db-buyer-abbr">{player.buyerTeam}</span>
                          <strong className="db-sold-price">{formatMoney(player.soldPrice)}</strong>
                        </div>
                      ) : (
                        <span className="base-price-label">N/A</span>
                      )}
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency Drawer */}
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
                <h4>Upload Player Database</h4>
                <button className="emergency-btn excel-upload-btn">
                  <FaFileExcel /> Batch Excel Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAuction