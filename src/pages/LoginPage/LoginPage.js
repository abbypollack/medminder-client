import './LoginPage.scss'
import Input from "../../components/Input/Input";
import GoogleAuthButton from '../../components/GoogleAuthButton/GoogleAuthButton';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        email: event.target.email.value,
        password: event.target.password.value
      };
      const response = await axios.post(`${SERVER_URL}}/api/users/login`, data);
      sessionStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data.message || 'Error logging in.');
    }
  };

  return (
    <main className="login-page">
      <form className="login" onSubmit={handleSubmit}>
        <h1 className="login__title">Log in</h1>

        <Input type="text" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />

        <button className="login__button">
          Log in
        </button>

        {error && <div className="login__message">{error}</div>}
      </form>
      <p>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
      <GoogleAuthButton buttonText="Login" />
    </main>
  );
}


export default LoginPage;
