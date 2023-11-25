import { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import MobileMenu from './../MobileMenu/MobileMenu';
import logo from '../../assets/icons/logo.svg'
import { AuthContext } from '../../auth/AuthContext';
import './Header.scss'
import LogoutButton from '../LogoutButton/LogoutButton'

function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };



    return (
        <header className="header">
            {/* Mobile Menu */}
            <div className="mobile-container">
                <Link to="/" className="mobile__logo-link">
                    <img src={logo} alt="logo" className='mobile-title' />
                </Link>
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? (
                        <MdClose size={30} />
                    ) : (
                        <FiMenu size={30} />
                    )}
                </button>
            </div>

            {/* Desktop/Tablet Navigation */}
            <nav className="header__nav">
                <ul className={`header__nav-list${isMobileMenuOpen ? ' hidden' : ''}`}>
                    <li className="header__nav-item">
                        <NavLink to="/" className="header__nav-link">
                            Home
                        </NavLink>
                    </li>
                    <li className="header__nav-item">
                        <NavLink to="/interactioncheck" className="header__nav-link">
                            Interaction Check
                        </NavLink>
                    </li>
                    <li className="header__nav-item">
                        <NavLink to="/medicationhistory" className="header__nav-link">
                            History
                        </NavLink>
                    </li>
                    <li className="header__nav-item">
                        <NavLink to="/mymedications" className="header__nav-link">
                            My Meds
                        </NavLink>
                    </li>
                    <li className="header__nav-item">
                        <NavLink to="/profile" className="header__nav-link">
                            Profile
                        </NavLink>
                    </li>

                    {!isLoggedIn && (
                        <>
                            <li className="header__nav-item">
                                <NavLink to="/login" className="header__nav-link">
                                    Log In
                                </NavLink>
                            </li>
                            <li className="header__nav-item">
                                <NavLink to="/signup" className="header__nav-link">
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                    {isLoggedIn && (
                        <LogoutButton />
                    )}
                </ul>
            </nav>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        </header>
    );
};

export default Header;