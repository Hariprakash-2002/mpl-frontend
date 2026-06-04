import React from 'react'
import './PointsTable.css'
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

const PointsTable = () => {
  const pools = {
    'Pool A': [
      { team: 'SBCC', logo: SBCC_Logo, P: 5, W: 4, L: 1, D: 0, NRR: 2.683, Pts: 8, form: ['W','W','W','W','L'] },
      { team: 'TOP STAR MURUNGAPATTI', logo: TSM_Logo, P: 5, W: 4, L: 1, D: 0, NRR: 1.510, Pts: 8, form: ['L','W','W','W','W'] },
      { team: 'KALAIPOONGHA', logo: Kalai_Logo, P: 5, W: 3, L: 2, D: 0, NRR: 0.220, Pts: 6, form: ['W','L','W','L','W'] },
      { team: 'RAINBOW CC', logo: Rain_Logo, P: 5, W: 2, L: 3, D: 0, NRR: 0.459, Pts: 4, form: ['W','L','L','W','L'] },
      { team: 'VALLARASU MEMORIAL', logo: VM_Logo, P: 5, W: 2, L: 3, D: 0, NRR: -1.724, Pts: 4, form: ['L','W','L','W','L'] },
      { team: 'FIREBOYS', logo: FB_Logo, P: 5, W: 0, L: 5, D: 0, NRR: -3.189, Pts: 0, form: ['L','L','L','L','L'] },
    ],
    'Pool B': [
      { team: 'PEPSI BOYS PETHAMPATTI', logo: Rain_Logo, P: 5, W: 5, L: 0, D: 0, NRR: 3.383, Pts: 10, form: ['W','W','W','W','W'] },
      { team: 'NG BOYS', logo: SBCC_Logo, P: 5, W: 4, L: 1, D: 0, NRR: 1.817, Pts: 8, form: ['W','W','L','W','W'] },
      { team: 'BEST FRIENDS', logo: SB_Logo, P: 5, W: 2, L: 3, D: 0, NRR: 0.5457, Pts: 4, form: ['L','W','W','L','L'] },
      { team: 'SPARK BOYS', logo: TSM_Logo, P: 5, W: 2, L: 3, D: 0, NRR: 0.077, Pts: 4, form: ['W','L','L','W','L'] },
      { team: 'YOUNG 11', logo: VM_Logo, P: 5, W: 2, L: 3, D: 0, NRR: -1.963, Pts: 4, form: ['L','W','L','L','W'] },
      { team: 'LCC LAGUVAMPATTI', logo: Y11s_Logo, P: 5, W: 0, L: 5, D: 0, NRR: 0.40, Pts: 0, form: ['L','L','L','L','L'] },
    ]
  }

  return (
    <div className="points-page">
      <div className="points-heading">
        <h1>Points Table</h1>
        <p>Current standings for each pool. Tables are responsive for mobile and desktop.</p>
        <hr />
      </div>

      <div className="pools-wrap">
        {Object.keys(pools).map((poolName) => (
          <section className="pool-card" key={poolName}>
            <h2 className="pool-title">{poolName}</h2>
            <div className="table-wrap">
              <table className="points-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>L</th>
                    <th>D</th>
                    <th>NRR</th>
                    <th>Pts</th>
                    <th>Recent Form</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Copy the array, sort it, and then map over it */}
                  {[...pools[poolName]]
                    .sort((a, b) => {
                      // 1. Sort by Points descending
                      if (b.Pts !== a.Pts) {
                        return b.Pts - a.Pts; 
                      }
                      // 2. If tied, sort by NRR descending
                      return parseFloat(b.NRR || 0) - parseFloat(a.NRR || 0); 
                    })
                    .map((t, i) => (
                      <tr key={i} className="points-row">
                        <td className="team-cell" data-label="Team">
                          <img src={t.logo} alt={`${t.team} logo`} />
                          <span>{t.team}</span>
                        </td>
                        <td data-label="P">{t.P}</td>
                        <td data-label="W">{t.W}</td>
                        <td data-label="L">{t.L}</td>
                        <td data-label="D">{t.D}</td>
                        <td data-label="NRR">{t.NRR}</td>
                        <td className="pts" data-label="Pts">{t.Pts}</td>
                        <td className="form-cell" data-label="Recent Form">
                          <div className="form-dots">
                            {t.form && t.form.map((r, idx) => (
                              <span key={idx} className={"form-dot " + (r === 'W' ? 'win' : 'loss')}>{r}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default PointsTable
