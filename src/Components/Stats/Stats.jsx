import React, { useState } from 'react'
import './Stats.css'
import { FaTrophy, FaAward, FaCrown, FaStar } from 'react-icons/fa'
import { FaRankingStar } from 'react-icons/fa6'
import { BsFire, BsLightningChargeFill } from 'react-icons/bs'

// Importing team logos for consistency
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

const Stats = () => {
    // Interactive tabs for navigation (default set to 'mvp')
    const [activeTab, setActiveTab] = useState('mvp');

    // 1. Most Valuable Player (MVP) Data
    const mvpLeaders = [
        { rank: 1, name: 'Sanjay Kumar', teamName: 'NG Boys', logo: Ng_Logo, points: 450, matches: 5, runs: 284, wickets: 2, catches: 3 },
        { rank: 2, name: 'Dinesh Karthik', teamName: 'Spark Boys', logo: SB_Logo, points: 410, matches: 5, runs: 50, wickets: 12, catches: 2 },
        { rank: 3, name: 'Arun Prasath', teamName: 'Spark Boys', logo: SB_Logo, points: 380, matches: 5, runs: 245, wickets: 0, catches: 1 },
        { rank: 4, name: 'Manoj Kumar', teamName: 'NG Boys', logo: Ng_Logo, points: 340, matches: 5, runs: 30, wickets: 10, catches: 1 },
        { rank: 5, name: 'Karthik Raja', teamName: 'Fire Boys', logo: FB_Logo, points: 310, matches: 5, runs: 210, wickets: 0, catches: 0 },
    ];

    // 2. Batting Stats Data (Orange Cap Leaderboard)
    const battingLeaders = [
        { rank: 1, name: 'Sanjay Kumar', teamName: 'NG Boys', logo: Ng_Logo, runs: 284, avg: '56.80', sr: '155.2', matches: 5 },
        { rank: 2, name: 'Arun Prasath', teamName: 'Spark Boys', logo: SB_Logo, runs: 245, avg: '49.00', sr: '142.1', matches: 5 },
        { rank: 3, name: 'Karthik Raja', teamName: 'Fire Boys', logo: FB_Logo, runs: 210, avg: '42.00', sr: '138.5', matches: 5 },
        { rank: 4, name: 'Vijay Anand', teamName: 'Vallarasu Memorial', logo: VM_Logo, runs: 195, avg: '39.00', sr: '130.0', matches: 5 },
    ];

    // 3. Bowling Stats Data (Purple Cap Leaderboard)
    const bowlingLeaders = [
        { rank: 1, name: 'Dinesh Karthik', teamName: 'Spark Boys', logo: SB_Logo, wickets: 12, econ: '5.80', avg: '12.40', matches: 5 },
        { rank: 2, name: 'Manoj Kumar', teamName: 'NG Boys', logo: Ng_Logo, wickets: 10, econ: '6.20', avg: '14.10', matches: 5 },
        { rank: 3, name: 'Ganesh Moorthi', teamName: 'LCC', logo: LCC_Logo, wickets: 8, econ: '6.90', avg: '18.25', matches: 5 },
        { rank: 4, name: 'Siva Prakash', teamName: 'Pepsi Boys', logo: PB_Logo, wickets: 7, econ: '7.10', avg: '19.50', matches: 5 },
    ];

    // 4. Tournament Records
    const tournamentRecords = [
        { title: 'Highest Individual Score', player: 'Sanjay Kumar', team: 'NG Boys', logo: Ng_Logo, stat: '104* (52b)', icon: <BsFire /> },
        { title: 'Best Bowling Figures', player: 'Dinesh Karthik', team: 'Spark Boys', logo: SB_Logo, stat: '5/12 (4 overs)', icon: <FaStar /> },
        { title: 'Most Sixes', player: 'Arun Prasath', team: 'Spark Boys', logo: SB_Logo, stat: '18 Sixes', icon: <BsLightningChargeFill /> },
        { title: 'Fastest Fifty', player: 'Karthik Raja', team: 'Fire Boys', logo: FB_Logo, stat: '52 (17b)', icon: <FaCrown /> },
    ];

    return (
        <div className='stats-container'>
            {/* Header section */}
            <div className="stats-heading">
                <h1>Tournament <span className="highlight">Standings & Stats</span></h1>
                <p>Track team standings, top run-scorers, wicket-takers, and legendary records</p>
                <hr width="11.5%" color="#FFD54F" />
            </div>

            {/* Interactive Tab bar styling */}
            <div className="All-stats-tabs">
                <div 
                    className={`tab-btn gold-accent-tab ${activeTab === 'mvp' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('mvp')}
                >
                    <p>MVP LEADERBOARD</p>
                </div>
                <div 
                    className={`tab-btn orange-accent-tab ${activeTab === 'batting' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('batting')}
                >
                    <p>ORANGE CAP</p>
                </div>
                <div 
                    className={`tab-btn purple-accent-tab ${activeTab === 'bowling' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('bowling')}
                >
                    <p>PURPLE CAP</p>
                </div>
                <div 
                    className={`tab-btn cyan-accent-tab ${activeTab === 'records' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('records')}
                >
                    <p>RECORDS</p>
                </div>
                
                <div className="tab-icon">
                    <FaRankingStar size={30} color="#FFD54F" />
                </div>
            </div>

            {/* Subheading tag section */}
            <div className={`stats-tag ${activeTab}-border`}>
                <FaTrophy size={20} color="#FFD54F" />
                <p>{activeTab === 'mvp' ? 'MOST VALUABLE PLAYER' : activeTab.toUpperCase()} OVERVIEW</p>
            </div>

            {/* Dynamic Rendering of Content based on Selected Tab */}
            <div className="stats-content-wrapper">
                
                {/* TAB 1: MOST VALUABLE PLAYER (MVP List) */}
                {activeTab === 'mvp' && (
                    <div className="player-stat-list">
                        {/* Showcase MVP Leader Card */}
                        <div className="spotlight-card gold-glow">
                            <div className="spotlight-header">
                                <FaCrown size={30} color="#FFD54F" />
                                <h3>MVP LEADER</h3>
                            </div>
                            <div className="spotlight-body">
                                <div className="spotlight-team">
                                    <img src={mvpLeaders[0].logo} alt="Team Logo" />
                                    <span>{mvpLeaders[0].teamName}</span>
                                </div>
                                <div className="spotlight-player">
                                    <h2>{mvpLeaders[0].name}</h2>
                                    <p className="main-highlight-stat">{mvpLeaders[0].points} Points</p>
                                </div>
                            </div>
                        </div>

                        {/* Standard MVP Ranking list */}
                        <div className="detailed-ranking-list">
                            {mvpLeaders.map((player) => (
                                <div className="stat-card gold-border" key={player.rank}>
                                    <div className="rank-badge">
                                        <p>RANK</p>
                                        <h4>#{player.rank}</h4>
                                    </div>
                                    <div className="player-profile-block">
                                        <img src={player.logo} alt="Team Logo" />
                                        <div>
                                            <h4>{player.name}</h4>
                                            <p>{player.teamName}</p>
                                        </div>
                                    </div>
                                    <div className="stat-metrics-block">
                                        <div>
                                            <p>MVP Points</p>
                                            <h3 className="gold-text">{player.points}</h3>
                                        </div>
                                        <div>
                                            <p>Runs</p>
                                            <h3>{player.runs}</h3>
                                        </div>
                                        <div>
                                            <p>Wickets</p>
                                            <h3>{player.wickets}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 2: BATTING LEADERBOARD (Orange Cap) */}
                {activeTab === 'batting' && (
                    <div className="player-stat-list">
                        {/* Showcase Leader Card */}
                        <div className="spotlight-card orange-glow">
                            <div className="spotlight-header">
                                <FaAward size={30} color="#FF7614" />
                                <h3>ORANGE CAP LEADER</h3>
                            </div>
                            <div className="spotlight-body">
                                <div className="spotlight-team">
                                    <img src={battingLeaders[0].logo} alt="Team Logo" />
                                    <span>{battingLeaders[0].teamName}</span>
                                </div>
                                <div className="spotlight-player">
                                    <h2>{battingLeaders[0].name}</h2>
                                    <p className="main-highlight-stat">{battingLeaders[0].runs} Runs</p>
                                </div>
                            </div>
                        </div>

                        {/* Standard Ranking list */}
                        <div className="detailed-ranking-list">
                            {battingLeaders.map((player) => (
                                <div className="stat-card orange-border" key={player.rank}>
                                    <div className="rank-badge">
                                        <p>RANK</p>
                                        <h4>#{player.rank}</h4>
                                    </div>
                                    <div className="player-profile-block">
                                        <img src={player.logo} alt="Team Logo" />
                                        <div>
                                            <h4>{player.name}</h4>
                                            <p>{player.teamName}</p>
                                        </div>
                                    </div>
                                    <div className="stat-metrics-block">
                                        <div>
                                            <p>Runs</p>
                                            <h3 className="orange-text">{player.runs}</h3>
                                        </div>
                                        <div>
                                            <p>SR</p>
                                            <h3>{player.sr}</h3>
                                        </div>
                                        <div>
                                            <p>AVG</p>
                                            <h3>{player.avg}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 3: BOWLING LEADERBOARD (Purple Cap) */}
                {activeTab === 'bowling' && (
                    <div className="player-stat-list">
                        {/* Showcase Leader Card */}
                        <div className="spotlight-card purple-glow">
                            <div className="spotlight-header">
                                <FaAward size={30} color="#A259FF" />
                                <h3>PURPLE CAP LEADER</h3>
                            </div>
                            <div className="spotlight-body">
                                <div className="spotlight-team">
                                    <img src={bowlingLeaders[0].logo} alt="Team Logo" />
                                    <span>{bowlingLeaders[0].teamName}</span>
                                </div>
                                <div className="spotlight-player">
                                    <h2>{bowlingLeaders[0].name}</h2>
                                    <p className="main-highlight-stat">{bowlingLeaders[0].wickets} Wickets</p>
                                </div>
                            </div>
                        </div>

                        {/* Standard Ranking list */}
                        <div className="detailed-ranking-list">
                            {bowlingLeaders.map((player) => (
                                <div className="stat-card purple-border" key={player.rank}>
                                    <div className="rank-badge">
                                        <p>RANK</p>
                                        <h4>#{player.rank}</h4>
                                    </div>
                                    <div className="player-profile-block">
                                        <img src={player.logo} alt="Team Logo" />
                                        <div>
                                            <h4>{player.name}</h4>
                                            <p>{player.teamName}</p>
                                        </div>
                                    </div>
                                    <div className="stat-metrics-block">
                                        <div>
                                            <p>Wickets</p>
                                            <h3 className="purple-text">{player.wickets}</h3>
                                        </div>
                                        <div>
                                            <p>ECON</p>
                                            <h3>{player.econ}</h3>
                                        </div>
                                        <div>
                                            <p>AVG</p>
                                            <h3>{player.avg}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: TOURNAMENT RECORDS */}
                {activeTab === 'records' && (
                    <div className="records-grid-container">
                        {tournamentRecords.map((record, index) => (
                            <div className="record-grid-card" key={index}>
                                <div className="record-icon-badge">
                                    {record.icon}
                                </div>
                                <p className="record-title">{record.title}</p>
                                <h2 className="record-stat-value">{record.stat}</h2>
                                <div className="record-holder-info">
                                    <img src={record.logo} alt="Team logo" />
                                    <div>
                                        <h4>{record.player}</h4>
                                        <p>{record.team}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Stats