import React from 'react'
import './ScoreCard.css'
import { GoDotFill } from "react-icons/go";
import NG_Boys_logo from '../../../../assets/NG_Boys_logo.png'
import BF_logo from '../../../../assets/Best_Friends_logo.png'

const ScoreCard = () => {
  return (
    <div className='score-card'>
        <div className="score1">
            <h3><GoDotFill color="red" size={25}/> LIVE NOW</h3>
            <h4>Match 3 - Pool A</h4>
        </div>
        <div className="score2">
            <div className="team1">
                <img src={NG_Boys_logo} alt="NG Logo" className='team-logo' />
                <p>--/- (8 overs)</p>
            </div>
            <div className="vs">VS</div>
            <div className="team2">
                <img src={BF_logo} alt="Best Friends Logo" className='team-logo' />
                <p>--/- (8 overs)</p>
            </div>
        </div>
        <div className="score3">
            <div className="s">
                <p>Captains arrived for the toss!</p>
            </div>
            <div className="score-btn">
                <button>View Live Score --</button>
            </div>
        </div>
        
        
    </div>
      
    
  )
}
import './ScoreCard.css'

export default ScoreCard
