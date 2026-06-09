import React from 'react'
import './Fixtures.css'
import { FaCalendar} from "react-icons/fa";
import { BsCalendar, BsClock } from 'react-icons/bs';
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
import { FaLocationPin } from 'react-icons/fa6';


const Fixtures = () => {

    const matches_dates =[
        {date: 'March 1',
            day: 'wed',
            Team_1_name : 'NG Boys',
            Team_2_name : 'Best Friends',
            Team_1 : Ng_Logo,
            Team_2 : BG_Logo,
            time: '7:00 PM'},
        {date: 'March 2',
            day: 'thu',
            Team_1_name : 'Fire Boys',
            Team_2_name : 'Pepsi Boys',
            Team_1 : FB_Logo,
            Team_2 : PB_Logo,
            time: '7:00 PM'},
        {date: 'March 3',
            day: 'fri',
            Team_1_name : 'Rainbow',
            Team_2_name : 'SBCC',
            Team_1 : Rain_Logo,
            Team_2 : SBCC_Logo,
            time: '7:00 PM'},
        {date: 'March 4',
            day: 'sat',
            Team_1_name : 'Spark Boys',
            Team_2_name : 'Top Star',
            Team_1 : SB_Logo,
            Team_2 : TSM_Logo,
            time: '7:00 PM'},
        {date: 'March 5',
            day: 'sun',
            Team_1_name : 'Vallarasu Memorial',
            Team_2_name : 'Youngs 11',
            Team_1 : VM_Logo,
            Team_2 : Y11s_Logo,
            time: '7:00 PM'},
        {date: 'March 6',
            day: 'mon',
            Team_1_name : 'Kalaipoonga',
            Team_2_name : 'LCC',
            Team_1 : Kalai_Logo,
            Team_2 : LCC_Logo,
            time: '7:00 PM'},
    ]


  return (
    <div className='fixtures'>
        <div className="fixtures-heading">
            <h1>Mathces & <span className="highlight">Fixtures</span></h1>
            <p>Stay updated with the latest match schedules and results</p>
            <hr width="11.5%" color="#FFD54F" />
        </div>
        <div className="All-matches-dates">
           
                <div className="all-dates">
                    <p>ALL DATES</p>
                </div>
                
                {matches_dates.map((item, index) => (
                    <div className="match-date" key={index}>
                        <p className="date">{item.date}</p>
                        <p className="day">{item.day}</p>
                    </div>
                ))}
                
                <div className="calender-icon">
                    <FaCalendar size={30} color="#FFD54F" />
                </div>
            
        </div>
        <div className="upcoming-tag">
            <BsCalendar size={20} color="#FFD54F" />
            <p>UPCOMING MATCHES</p>
        </div>
        <div className="all-matches-list">
            <h3 className="highlight">Updated after auction</h3>
        {/* {matches_dates.map((item, index) => (
            <div className="matches-list" key={index}>
                
                <div className="date-detiles">
                    <p><BsClock /> {item.time}</p>
                    <p>{item.date} {item.day}</p>
                </div>
                <div className="matches-teams">
                        <p>{item.Team_1_name}</p>
                        <img src={item.Team_1}  alt="Team 1" />
                        <p>vs</p>
                        <img src={item.Team_2}  alt="Team 2" />
                        <p>{item.Team_2_name}</p>
                    </div>
                <div className="matches-pool">
                    <p><FaLocationPin /> Poompattyanoor Stadium</p>
                    <p>Pool A</p>
                </div>
            </div>
        ))} */}
        </div>
    </div>
  )
}

export default Fixtures
