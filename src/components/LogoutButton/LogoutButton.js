import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
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
    <button className="logout-button" onClick={handleLogout}>
      <span className="logout-button__text">Logout</span>
    </button>
  );
};

export default LogoutButton;
