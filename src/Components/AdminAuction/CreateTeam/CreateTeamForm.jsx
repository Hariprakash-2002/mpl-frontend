import React, { useState } from 'react';
import './CreateTeamForm.css';

const CreateTeamForm = ({ onTeamCreated }) => {
  const [team, setTeam] = useState({
    name: '',
    shortName: '',
    ownerName: '',
    totalPurse: 100000000 // Default 10 Crore
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:8080/team/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team)
    });

    if (response.ok) {
      const newTeam = await response.json();
      alert("Team created successfully!");
      onTeamCreated(newTeam); // Callback to refresh UI list
      setTeam({ name: '', shortName: '', ownerName: '', totalPurse: 100000 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <input 
        type="text" 
        placeholder="Team Name or Number" 
        value={team.name} 
        onChange={(e) => setTeam({ ...team, name: e.target.value })} 
        required 
      />
      <input 
        type="text" 
        placeholder="Captain name (e.g. Saravanan))" 
        value={team.shortName} 
        onChange={(e) => setTeam({ ...team, shortName: e.target.value })} 
        required 
      />
      <input 
        type="text" 
        placeholder="Owner name (e.g. Saravanan))" 
        value={team.ownerName} 
        onChange={(e) => setTeam({ ...team, ownerName: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Total Purse (INR)" 
        value={team.totalPurse} 
        onChange={(e) => setTeam({ ...team, totalPurse: Number(e.target.value) })} 
        required 
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default CreateTeamForm;