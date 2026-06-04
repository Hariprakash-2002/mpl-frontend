import React from 'react'
import './LeagueInfo.css'
import { MdSportsCricket } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";


const LeagueInfo = () => {
    const info = {
    overs: {
        icon: MdSportsCricket,
        count: 8,
        label: 'Overs'
    },
    pools: {
        icon: FaUsers,
        count: 2,
        label: 'Pools'
    },
    teams: {
        icon: FaPeopleGroup,
        count: 12,
        label: 'Teams'
    },
    matches: {
        icon: GiCrossedSwords,
        count: 24,
        label: 'Matches'
    },
    champions: {
        icon: FaTrophy,
        count: 1,
        label: 'Champions'
    }
}


  return (
    <div className='league-info-container'>
        {Object.values(info).map((item) => (
            <div className="info-container" key={item.label}>
                 <div className="icon">
                        {<item.icon size={35} className="icon"/>}
                    </div>
                <div className="info">
                   
                    <span className="count">{item.count}</span>
                    <span className="label">{item.label}</span>
                </div>
            </div>
        ))}
    </div>
  )
}

export default LeagueInfo
