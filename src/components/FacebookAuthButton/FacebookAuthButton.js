const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const FacebookAuthButton = ({ buttonText }) => {
  return (
    <a className="facebook-auth-button" href={`${SERVER_URL}/auth/facebook`}>
      <span className="facebook-auth-button__text">{buttonText} with Facebook</span>
    </a>
  );
};

export default FacebookAuthButton;
