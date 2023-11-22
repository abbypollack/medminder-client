import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import Profile from '../../components/Profile/Profile';
import LoginButton from '../../components/LoginButton/LoginButton';

function ProfilePage() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <>
        <p><strong>This page requires authentication.</strong></p>
        <LoginButton />
      </>
    );
  }

  return (
    <>
      <Profile />
    </>
  );
}

export default ProfilePage;
