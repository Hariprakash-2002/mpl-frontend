import React from 'react'
import './Upcoming.css'
import Ng_Logo from '../../../../assets/NG_Boys_logo.png'
import BG_Logo from '../../../../assets/Best_Friends_logo.png'
import FB_Logo from '../../../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../../../assets/Pepsi_logo.png'
import Rain_Logo from '../../../../assets/Rainbow_logo.png'
import SBCC_Logo from '../../../../assets/SBCC_logo.png'
import SB_Logo from '../../../../assets/Spark_Boys_logo.png'
import TSM_Logo from '../../../../assets/Top_Star_logo.png'
import VM_Logo from '../../../../assets/Vallarasu_Memorial_logo.png'
import Y11s_Logo from '../../../../assets/Youngs_11_logo.png'
import Kalai_Logo from '../../../../assets/Kalaipoonga_logo.png'
import LCC_Logo from '../../../../assets/LCC_logo.png'
const Upcoming = () => {
    const upcomingMatches = [
        { id: 1, team1: FB_Logo, team2: Kalai_Logo, date: '----/--/--', time: '14:00', match: 15 ,stadium: 'Poompattyanoor Stadium'},
        { id: 2, team1: PB_Logo, team2: Rain_Logo, date: '----/--/--', time: '16:00', match: 16 ,stadium: 'Poompattyanoor Stadium'},
        { id: 3, team1: SBCC_Logo, team2: SB_Logo, date: '----/--/--', time: '18:00' , match: 17 ,stadium: 'Poompattyanoor Stadium'},
    ];
  return (
    <div className='upcoming-matches'>
        <div className="heading">
            <p>Upcoming Matches</p>
            <p>View all fixtures</p>
        </div>
        <div className="matches-list">
            <h1>Will be updated after auction</h1>
            {/* {upcomingMatches.map(match => (
                <div key={match.id} className="match-card">
                    <p>Match {match.match}</p>
                    <div className="teams">
                        <img src={match.team1}  alt="Team 1" />
                        <p>vs</p>
                        <img src={match.team2}  alt="Team 2" />
                    </div>
                    
                    <p>{match.date} at {match.time}</p>
                    <p>Stadium: {match.stadium}</p>
                </div>
            ))} */}
        </div>
      
    </div>
  )
}

export default Upcoming
