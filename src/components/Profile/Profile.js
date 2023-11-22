import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import LogoutButton from '../LogoutButton/LogoutButton';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };

  return (
    <section className="profile-page">
      <h1>Profile Page</h1>
      {user && (
        <>
          <h2>Hello, {user.username}</h2>
          <h3>Registered since: {formatDate(user.updated_at)}</h3>
          <img
            className="profile-page__avatar"
            src={user.avatar_url}
            alt={`${user.username}'s avatar`}
          />
          <LogoutButton />
        </>
      )}
    </section>
  );
}

export default Profile;
