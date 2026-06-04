import React from 'react'
import './AllInfo.css'
import { BsBroadcast } from "react-icons/bs";
import { MdEventNote } from "react-icons/md";
import { PiRankingFill } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaGavel } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";




const AllInfo = () => {
    const info = {
        live: {
            icon: BsBroadcast,
            title: 'Live Scores',
            label: 'Ball by ball updates',
            color: '#FF5733'
        },
        fixtures: {
            icon: MdEventNote,
            title: 'Fixtures',
            label: 'Full Match Schedule',
            color: '#3498DB'
        },
        points: {
            icon: PiRankingFill,
            title: 'Points Table',
            label: 'Team Standings',
            color: '#2ECC71'
        },
        teams: {
            icon: FaPeopleGroup,
            title: 'Team',
            label: 'All Teams',
            color: '#1A59B1'
        },
        Auction: {
            icon: FaGavel,
            title: 'Auction',
            label: 'Live & Sold Players',
            color: '#E74C3C'
        },
        Gallery: {
            icon: MdPhotoLibrary,
            title: 'Gallery',
            label: 'Moments of the League',
            color: '#ff00ff'
        }
    }


  return (
     <div className='all-info-container'>
        {Object.values(info).map((item) => (
            <div className="info-container-1" key={item.label}>
                 <div className="icon">
                        {<item.icon size={35} color={item.color} className="icon"/>}
                    </div>
                <div className="info-1">
                   
                    <span className="count">{item.title}</span>
                    <span className="label">{item.label}</span>
                </div>
            </div>
        ))}
    </div>
  )
}

export default AllInfo
