import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import Profile from '../../components/Profile/Profile';
import Unauthenticated from '../../components/Unauthenticated/Unauthenticated';

function ProfilePage() {
  const { isLoggedIn } = useContext(AuthContext);

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
