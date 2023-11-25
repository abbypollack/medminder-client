import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const profileData = Object.fromEntries(formData.entries());
  
    try {
      const response = await axios.patch(`${API_URL}/updateProfile`, profileData, {
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
      <div>
        <h1>Dashboard</h1>
        <h3>Hello, {user?.first_Nme || user?.name || 'User'}! 👋</h3>
        <div>
          <Link to="/medicationhistory">
            <button>Log today’s medication</button>
          </Link>
          <Link to="/view-medications">
            <button>View my medications</button>
          </Link>
        </div>
      </div>
      <div>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            required
            defaultValue={user?.firstName}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            required
            defaultValue={user?.lastName}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            required
            defaultValue={user?.phone}
          />
          <button type="submit">Save Edits</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;