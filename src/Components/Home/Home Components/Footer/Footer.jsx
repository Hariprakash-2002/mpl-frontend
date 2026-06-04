import React from 'react'
import './Footer.css'
import { MdSportsCricket } from "react-icons/md";
import { FaUsers  , FaUser ,FaFacebook, FaInstagram , FaTwitter} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";
const Footer = () => {
      const info = {

        teams: {
          icon: FaPeopleGroup,
          count: 12,
          label: 'Teams'
        },

        pools: {
            icon: FaUsers,
            count: 2,
            label: 'Pools'
        },
        overs: {
            icon: MdSportsCricket,
            count: 8,
            label: 'Overs'
        },
       
        
        matches: {
            icon: GiCrossedSwords,
            count: 24,
            label: 'Matches'
        },
        players: {
            icon: FaUser,
            count: 120,
            label: 'Players'
        },
        fans:{
            icon: FaUsers,
            count: 5000,
            label: 'Fans'
        },
        champions: {
            icon: FaTrophy,
            count: 1,
            label: 'Champions'
        }
  }
  
  
    return (
      <div className='footer-container'>
          {Object.values(info).map((item) => (
              <div className="footer-item" key={item.label}>
                   <div className="icon">
                          {<item.icon size={50} className="icon"/>}
                      </div>
                  <div className="footer-info">
                     
                      <span className="count">{item.count}</span>
                      <span className="label">{item.label}</span>
                  </div>
              </div>
          ))}
          <div className="social">
            <p>FOLLOW US on</p>
            <div className="icons">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="icon" size={30} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="icon" size={30} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="icon" size={30} />
              </a>
            </div>
              
          </div>
      </div>
    )
  }


export default Footer
