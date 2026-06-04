

import axios from 'axios'

export const getTeams = async () => {
    const response = await axios.get("http://localhost:8080/team/all");
    return response.data;
}


