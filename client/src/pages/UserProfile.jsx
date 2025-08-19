import { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setProfileError('Not logged in');
          return;
        }

        const res = await axios.get('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:3000/users/profile/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordError('');
      setShowModal(false);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
      setSuccessMsg('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            User Profile
          </h2>

          {profileError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
              {profileError}
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <p><span className="font-semibold">Username:</span> {user.username}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                Change Password
              </button>
            </div>
          ) : !profileError && (
            <p className="text-gray-500">Loading profile...</p>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
                >
                  &times;
                </button>
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Current Password */}
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border rounded pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>

                {/* Password change error or success below the form */}
                {passwordError && <p className="mt-2 text-red-600">{passwordError}</p>}
                {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
