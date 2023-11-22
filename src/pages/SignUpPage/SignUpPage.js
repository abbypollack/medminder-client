import './SignUpPage.scss';
import LoginButton from '../../components/LoginButton/LoginButton';

const SignupPage = () => {
  const handleSignup = (signupData) => {
    // API call 
    console.log("Signup Data:", signupData);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <LoginButton />
    </div>
  );
};

export default SignupPage;