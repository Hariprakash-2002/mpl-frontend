import React from 'react'
import './Pool.css'
const Pool = () => {

 const poolAData = [
    { id: 1, pool: 'Pool A', team: 'SBCC', teamlogo: 5, captainName: "Praveen Kumar", liked: 2 },
    { id: 2, pool: 'Pool A', team: 'TOP STAR', teamlogo: 5, captainName: "Sivaraj", liked: 3 },
    { id: 3, pool: 'Pool A', team: 'KALAIPOONGHA', teamlogo: 5, captainName: "Prakash", liked: 1 },
    { id: 4, pool: 'Pool A', team: 'RAINBOW CC', teamlogo: 5, captainName: "Karthik", liked: 4 },
    { id: 5, pool: 'Pool A', team: 'VALLARASU MEMORIAL', teamlogo: 5, captainName: "Thangam", liked: 0 },
    { id: 6, pool: 'Pool A', team: 'FIREBOYS', teamlogo: 5, captainName: "Prakash PT", liked: 5 },
];

const poolBData = [
    { id: 1, pool: 'Pool B', team: 'PEPSI BOYS', teamlogo: 5, captainName: "Vadivazhagan", liked: 2 },
    { id: 2, pool: 'Pool B', team: 'NG BOYS', teamlogo: 5, captainName: "Murugan", liked: 3 },
    { id: 3, pool: 'Pool B', team: 'BEST FRIENDS', teamlogo: 5, captainName: "Srinivasan", liked: 1 },
    { id: 4, pool: 'Pool B', team: 'SPARK BOYS', teamlogo: 5, captainName: "Saravana Kumar", liked: 4 },
    { id: 5, pool: 'Pool B', team: 'YOUNGS 11', teamlogo: 5, captainName: "Arivazhagan", liked: 0 },
    { id: 6, pool: 'Pool B', team: 'LCC BOYS', teamlogo: 5, captainName: "Santhosh", liked: 5 },
];

  return (
    <div className='pool-container'>
      <div className="heading">
        <p>Pool Standings</p>
        <p>View all standings</p>
      </div>
      <div className="pool-table">
        <div className="pool-A-table">
            <h2>Pool A</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Captain</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {poolAData.map((team) => (
                        <tr key={team.id}>
                            <td>{team.id}</td>
                            <td>{team.team}</td>
                            <td>{team.captainName}</td>
                            <td>{team.liked}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="pool-B-table">
            <h2>Pool B</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Captain</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {poolBData.map((team) => (
                        <tr key={team.id}>
                            <td>{team.id}</td>
                            <td>{team.team}</td>
                            <td>{team.captainName}</td>
                            <td>{team.liked}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    </div>
  )
}

export default Pool
