
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import TeamsMain from './Components/TeamsMain/TeamsMain'
import Home from './Components/Home/Home'
import hero_icon from './assets/hero_1.png'
import team_bg from './assets/team_bg.png'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Fixtures from './Components/Fixtures/Fixtures'
import PointsTable from './Components/Points_Table/PointsTable'
import Players from './Components/Players/Players'
import Auction from './Components/Auction/Auction'
import Gallery from './Components/Gallery/Gallery'
import Stats from './Components/Stats/Stats'
import AdminAuction from './Components/AdminAuction/AdminAuction'
import CreateTeamForm from './Components/AdminAuction/CreateTeam/CreateTeamForm'

function App() {
  

  return (
    <div className="app">
      
        <Navbar />
        <main className='main-content'>
        <Routes>
          <Route path = '/' element={<Home />} />
          <Route path='/teams' element={<TeamsMain />} />
          <Route path='/matches' element={<Fixtures />}/>
          <Route path='/pointstable' element={<PointsTable />}/>
          <Route path='/players' element={<Players />}/>
          <Route path='/auction' element={<Auction />} />
          <Route path= '/gallery' element={<Gallery />} />
          <Route path='/stats' element={<Stats />} />
          <Route path='/sponsors' element = {<AdminAuction />} />
          <Route path='/createteam' element = {<CreateTeamForm />} />
        </Routes>
        </main>
      
      
    </div>
  )
}

export default App
