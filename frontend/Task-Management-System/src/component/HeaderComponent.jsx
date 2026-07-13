import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout, getLoggedInUser } from '../service/AuthApiService';
import DarkModeToggle from './DarkModeToggle';
import WorkZenLogo from './WorkZenLogo';
import { LogOut } from 'lucide-react';
import '../css/tasks.css';

const HeaderComponent = () => {
    const isAuth = isUserLoggedIn();
    const navigate = useNavigate();
    const username = getLoggedInUser();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <nav className="navbar navbar-expand-lg app-navbar">
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <WorkZenLogo />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav gap-1 ms-auto align-items-lg-center">
                        {isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/tasks">Tasks</NavLink>
                            </li>
                        )}
                        {isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/history">History</NavLink>
                            </li>
                        )}

                        {!isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/create-account">Create account</NavLink>
                            </li>
                        )}
                        {!isAuth && (
                            <li className="nav-item">
                                <NavLink className="nav-link nav-link--cta" to="/login">Log in</NavLink>
                            </li>
                        )}

                        <li className="nav-item ms-lg-2">
                            <DarkModeToggle />
                        </li>

                        {isAuth && (
                            <li className="nav-item user-chip" title={username}>
                                <span className="user-avatar" aria-hidden="true">
                                    {username ? username.charAt(0).toUpperCase() : '?'}
                                </span>
                                <span className="user-name">{username}</span>
                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                    aria-label="Log out"
                                    title="Log out"
                                >
                                    <LogOut size={14} strokeWidth={2.25} />
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HeaderComponent;
