import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/auth/signup', formData);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen px-10 py-16 flex flex-col items-center text-center bg-[#f9f9f9] font-sans rounded-xl">
      <h1 className="text-3xl font-semibold mb-6">Create an Account</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-left text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            required
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border-[0.5px] border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border-[0.5px] border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-left text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border-[0.5px] border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
