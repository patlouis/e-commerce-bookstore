import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not logged in');
          return;
        }

        const res = await axios.get('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            User Profile
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <p><span className="font-semibold">Username:</span> {user.username}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          ) : !error && (
            <p className="text-gray-500">Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
