import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import Profile from '../../components/Profile/Profile';

function ProfilePage() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <div className="unauthenticated-profile">
        <p><strong>You must be logged in to view your profile.</strong></p>
        <p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to continue.</p>
      </div>
    );
  }

  return (
    <>
      <Profile />
    </>
  );
}

export default ProfilePage;
