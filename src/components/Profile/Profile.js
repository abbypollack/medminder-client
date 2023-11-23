import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import LogoutButton from '../LogoutButton/LogoutButton';
import axios from 'axios';

const Profile = () => {
  const API_URL = process.env.REACT_APP_SERVER_URL
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const profileData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(`${API_URL}/updateProfile`, profileData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUser({ ...user, ...response.data.updatedUser });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };


  return (
    <section className="profile-page">
      <h1>Profile Page</h1>
      {user && (
        <>
          <h2>Hello, {user.username}</h2>
          <img className="profile-page__avatar" src={user.avatar_url} alt={`${user.username}'s avatar`} />
          <LogoutButton />
          <form onSubmit={handleSubmit}>
            {!user.firstName && <input name="firstName" placeholder="First Name" required />}
            {!user.lastName && <input name="lastName" placeholder="Last Name" required />}
            {!user.phone && <input name="phone" placeholder="Phone" required />}
            <button type="submit">Update Profile</button>
          </form>
        </>
      )}
    </section>
  );
};

export default Profile;

