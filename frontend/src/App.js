import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { getLoggedInUser, login } from './api/UserAPI';
import NewGamePage from './pages/NewGamePage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            if (localStorage.getItem("token") !== 'null') {
                let response = await getLoggedInUser(localStorage.getItem("token"));
                let data = await response.json();
                if (data.username) {
                    setIsLoggedIn(true);
                    setUser(data);
                }
            }
        }
        if (!user) {
            getUser();
        }
    }, [user])

    const handleLogin = async (evt) => {
        evt.preventDefault();
        let userObject = {
            username: evt.target.username.value,
            password: evt.target.password.value,
        }
        let response = await login(userObject);
        let data = await response.json();
        if (data.token) {
            localStorage.setItem("token", `${data.token}`);
            setIsLoggedIn(true);
            setUser(data.user);
        }
    }

    const handleLogout = () => {
        localStorage.setItem("token", null);
        setIsLoggedIn(false);
        setUser(null);
    }

    const renderLoginPage = () => {
        return (
            <LoginPage
                isLoggedIn={isLoggedIn}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                user={user}
            />
        )
    }

    const renderHomePage = () => {
        return (
            <HomePage
                isLoggedIn={isLoggedIn}
                user={user}
                handleLogout={handleLogout}
            />
        )
    }

    const renderNewGamePage = () => {
        return <NewGamePage user={user} />;
    }

    return (
        <div className="App">
            <Router>
                <div>
                    <Route exact path="/" render={renderHomePage} />
                    <Route exact path="/login" render={renderLoginPage} />
                    <Route exact path="/signup" component={SignupPage} />
                    <Route exact path='/new-game' render={renderNewGamePage}></Route>
                </div>
            </Router>
        </div>
    );
}

export default App;

