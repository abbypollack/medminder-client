const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const GoogleAuthButton = ({ buttonText }) => {
  return (
    <a className="google-auth-button" href={`${SERVER_URL}/auth/google`}>
      <span className="google-auth-button__text">{buttonText} with Google</span>
    </a>
  );
};

export default GoogleAuthButton;
