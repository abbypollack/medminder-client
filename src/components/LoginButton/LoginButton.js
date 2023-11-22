const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginButton = () => {
  return (
    <a className="login-button" href={`${SERVER_URL}/auth/google`}>
      <span className="login-button__text">Login with Google</span>
    </a>
  );
};

export default LoginButton;