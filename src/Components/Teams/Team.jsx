import React from 'react'
import './Team.css'
import { useQuery } from '@tanstack/react-query'
import {getTeams} from './getTeam'
const Team = () => {
    const {data ,isLoading, error} = useQuery({
        queryKey : ['teams'],
        queryFn : getTeams,
        staleTime : 5 * 60 * 1000, // 5 minutes
        refetchOnMount : false,
    })

    //
    // if(data) return console.log(data);
  return (
    <div className='team'>
      <h2>Teams</h2>
       {isLoading &&  <h2>Loading...</h2>}
       {error &&  <h2>Something went wrong...</h2>}
      <div className="team-container">
        {
            data?.map((team) => (
                <div className="team-card" key={team.id}>
                    <h3>{team.teamName}</h3>
                    <p>Captain: {team.captainName}</p>
                    <p>Pool: {team.pool}</p>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Team
