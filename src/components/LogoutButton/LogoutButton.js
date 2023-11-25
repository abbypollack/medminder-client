import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const LogoutButton = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (

    <li className="header__nav-item">
      <Link className="header__nav-link" onClick={handleLogout}>
        Log Out
      </Link>
    </li>
  );
};

export default LogoutButton;
