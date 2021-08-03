import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../api/GameAPI';

const HomePage = ({ isLoggedIn, user, handleLogout }) => {
    const token = localStorage.getItem('token');
    const [games, setGames] = useState([]);

    const renderGames = () => {
        if (games.length === 0) return <div>No games played!</div>

        let gamesWon = 0;
        let gamesLost = 0;

        for (const game of games) {
            if (game.won) gamesWon++;
            else gamesLost++;
        }

        return (
            <div>
                <h3>Games Won: {gamesWon}</h3>
                <h3>Games Lost: {gamesLost}</h3>
            </div>
        )
    }

    useEffect(() => {
        if (user === null) return;

        const setGamesAsync = async () => {
            const data = await getGames(user.id, token);
            setGames(data['games']);
        }

        if (games.length === 0) setGamesAsync();
    })

    return (
        <div>
            <h1>Home Page</h1>
            {
                user &&
                <div>
                    <div>Logged in as: {user.username}</div>
                    {renderGames()}
                    <Link to='/new-game/'>New Game</Link>
                    <br /><br />
                </div>
            }
            {
                !isLoggedIn
                    ?
                    <div>
                        <div>
                            <Link to='/login'>Login</Link>
                        </div>
                        <div>
                            <Link to='/signup'>Signup</Link>
                        </div>
                    </div>
                    :
                    <button onClick={handleLogout}>Logout</button>
            }
        </div>
    );
};

export default HomePage;
