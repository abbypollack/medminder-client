import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const { user, setUser } = useContext(AuthContext);
  console.log('User state in Profile component:', user);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.patch(`${API_URL}/api/users/updateProfile`, JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });      
      setUser({ ...user, ...response.data.updatedUser });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response);
      alert('Failed to update profile.');
    }
  };
  

  return (
    <section className="profile-page">
      <div>
        <h1>Dashboard</h1>
        <h3>Hello, {user?.firstName || user?.name || 'User'}! 👋</h3>
        <div>
          <Link to="/medicationhistory">
            <button>Log today’s medication</button>
          </Link>
          <Link to="/mymedications">
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
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
          <button type="submit">Save Edits</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;