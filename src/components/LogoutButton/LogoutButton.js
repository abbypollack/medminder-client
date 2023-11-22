const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LogoutButton = () => {
  return (
    <a className="logout-button" href={`${SERVER_URL}/auth/logout`}>
      <span className="logout-button__text">Logout</span>
    </a>
  );
};

export default LogoutButton;