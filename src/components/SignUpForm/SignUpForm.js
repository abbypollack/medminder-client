import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', { email, password, username });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignUp = (response) => {
    const tokenId = response.tokenId;
    axios.post('/api/auth/google', { tokenId })
      .then((response) => {
        console.log('Google sign-in success', response);
        // navigate('/profile');
      })
      .catch((error) => {
        console.error('Google sign-in error', error);
      });
  };


  return (
    <div>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        <div className="google-sign-in">
          <div id="googleSignInButton"></div>
        </div>
      </form>
    </div>
  );
}


export default SignUpForm;
