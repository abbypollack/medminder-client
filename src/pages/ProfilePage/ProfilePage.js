import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import Profile from '../../components/Profile/Profile';
import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';

function ProfilePage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  console.log('isLoggedIn state:', isLoggedIn);
  console.log('User data:', user);

  if (!isLoggedIn) {
    return (
      <Unauthenticated />
    );
  }

  return (
    <>
      <Profile />
    </>
  );
}

export default ProfilePage;
