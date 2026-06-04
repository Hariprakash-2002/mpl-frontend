import React from 'react'
import './Home.css'
import ScoreCard from './Home Components/ScoreCard/ScoreCard'
import LeagueInfo from './Home Components/LeagueInfo/LeagueInfo'
import hero_logo from '../../assets/hero_logo.png'
import AllInfo from './Home Components/AllInfo/AllInfo'
import Upcoming from './Home Components/Upcoming_matches/Upcoming'
import Pool from './Home Components/Pool/Pool'
import Footer from './Home Components/Footer/Footer'

const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }} className='home'>
      <img src={hero_logo} alt="Hero Logo" className='hero-logo' />
      <ScoreCard className='score-card'/>
      <LeagueInfo className='league-info-container'/>
      <AllInfo className='all-info-container'/>
      <Upcoming className='upcoming-matches'/>
      <Pool className='pool-container' />
      <Footer className='footer-container' />
    </div>
  )
}

export default Home
