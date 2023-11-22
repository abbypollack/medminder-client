import './LoginPage.scss'
import LoginButton from '../../components/LoginButton/LoginButton';

const LoginPage = () => {
  const handleLogin = (loginData) => {
    //  API call
    console.log("Login Data:", loginData);
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginButton />
    </div>
  );
};

export default LoginPage;