import './Footer.scss'
import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/icons/logo.svg';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__logo-container">
                <Link to="/" className="footer__logo-link">
                    <img src={logo} alt="MedMinder Logo" className="footer__logo" />
                </Link>
                <p className="footer__nav-navigate">Navigate to</p>
            </div>
            <nav className="footer__nav">
                <ul className="footer__nav-list">
                    <div className="footer__nav-column">
                        <li className="footer__nav-item">
                            <NavLink to="/" className="footer__nav-link">
                                Home
                            </NavLink>
                        </li>
                        <li className="footer__nav-item">
                            <NavLink to="/interactioncheck" className="footer__nav-link">
                                Interaction Check
                            </NavLink>
                        </li>
                        <li className="footer__nav-item">
                            <NavLink to="/medicationhistory" className="footer__nav-link">
                                History
                            </NavLink>
                        </li>
                    </div>
                    <div className="footer__nav-column">
                        <li className="footer__nav-item">
                            <NavLink to="/profile" className="footer__nav-link">
                                Profile
                            </NavLink>
                        </li>
                        <li className="footer__nav-item">
                            <NavLink to="/mymedications" className="footer__nav-link">
                                My Meds
                            </NavLink>
                        </li>
                        <li className="footer__nav-item">
                            <NavLink to="/login" className="footer__nav-link">
                                Log In
                            </NavLink>
                        </li>
                        <li className="footer__nav-item">
                            <NavLink to="/signup" className="footer__nav-link">
                                Sign Up
                            </NavLink>
                        </li>
                    </div>
                </ul>
            </nav>
            <p className="footer__copyright">&copy; 2023 MedMinder. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
