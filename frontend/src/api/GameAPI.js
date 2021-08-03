const BASE_URL = 'http://localhost:8000';

const getGames = async (userID, token) => {
    const response = await fetch(`${BASE_URL}/users/${userID}/games/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
        }
    })
    const data = await response.json();
    return data;
}

const createGame = async (gameObj, token) => {
    const response = await fetch(`${BASE_URL}/users/${gameObj.user}/games/new/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${token}`,
        },
        body: JSON.stringify(gameObj)
    })
    const data = await response.json();
    return data;
}

export { getGames, createGame }