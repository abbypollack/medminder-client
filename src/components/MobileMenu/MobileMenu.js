import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import './MobileMenu.scss';

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`mobile-menu${isOpen ? ' open' : ''}`}>
      <ul className="mobile-menu__list">
        <li className="mobile-menu__item">
          <NavLink to="/" onClick={onClose} className="mobile-menu__link">
            Home
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/interactioncheck" className="mobile-menu__link" onClick={onClose}>
            Interaction Check
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/medicationhistory" className="mobile-menu__link" onClick={onClose}>
            History
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/mymedications" className="mobile-menu__link" onClick={onClose}>
            My Meds
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/profile" className="mobile-menu__link" onClick={onClose}>
            Profile
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/login" className="mobile-menu__link" onClick={onClose}>
            Log In
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to="/signup" className="mobile-menu__link" onClick={onClose}>
            Sign Up
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
