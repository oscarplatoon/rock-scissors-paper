import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { createGame } from '../api/GameAPI';

function NewGamePage({ user }) {
    const [userThrow, setUserThrow] = useState(null);
    const [computerThrow, setComputerThrow] = useState(null);
    const [gameStatus, setGameStatus] = useState('');
    const gameOptions = ['rock', 'scissors', 'paper'];
    const token = localStorage.getItem('token');

    const handleButtonSubmit = (event) => {
        // setUserThrow(event.target.value);
        const userThrow = event.target.value;
        setUserThrow(userThrow);
        if (userThrow === 'rock' && computerThrow === 'scissors') {
            setGameStatus('won');
        } else if (userThrow === 'rock' && computerThrow === 'paper') {
            setGameStatus('lost');
        } else if (userThrow === 'scissors' && computerThrow === 'paper') {
            setGameStatus('won');
        } else if (userThrow === 'scissors' && computerThrow === 'rock') {
            setGameStatus('lost');
        } else if (userThrow === 'paper' && computerThrow === 'rock') {
            setGameStatus('won');
        } else if (userThrow === 'paper' && computerThrow === 'scissors') {
            setGameStatus('lost');
        } else {
            setGameStatus('tied');
        }
    }

    const refreshPage = () => {
        window.location.reload();
    }

    useEffect(() => {
        if (user === null) return;
        if (gameStatus === '') return;

        const createGameAsync = async () => {
            if (gameStatus === 'tied') return;

            let gameObj = {
                'user': user.id,
                'won': null,
                'user_throw': userThrow,
                'computer_throw': computerThrow
            }

            if (gameStatus === 'won') {
                gameObj['won'] = true;
            } else if (gameStatus === 'lost') {
                gameObj['won'] = false;
            }

            const data = await createGame(gameObj, token);
            return data;
        }

        const data = createGameAsync();
    }, [gameStatus])

    useEffect(() => {
        const randomInt = Math.floor(Math.random() * 3);
        setComputerThrow(gameOptions[randomInt]);
    }, [])

    const renderContent = () => {
        if (!gameStatus) {
            return (
                <div className='game-options'>
                    <button value='rock' onClick={handleButtonSubmit}>&#9994;</button>
                    <button value='paper' onClick={handleButtonSubmit}>&#9995;</button>
                    <button value='scissors' onClick={handleButtonSubmit}>&#9996;</button>
                </div>
            )
        } else if (gameStatus) {
            return (
                <div>
                    <div>Computer threw {computerThrow}!</div>
                    <div>You threw {userThrow}!</div>
                    <h4>You {gameStatus}!</h4>
                </div>
            )
        }
    }

    return (
        <div>
            <h1>Play a Game</h1>
            {renderContent()}
            <Link onClick={refreshPage} to='/new-game/'>New Game</Link>
            &nbsp;&nbsp;
            <Link to='/'>Home</Link>
        </div >
    )
}

export default NewGamePage;