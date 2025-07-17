import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Email not found");
        return;
      }

      setShowPasswordFields(true);
      toast.success("Email verified. Please enter your new password.");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to reset password");
        return;
      }

      toast.success("Password has been reset successfully");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4'>
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
        <div className="p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link to='/'>
              <h2 className='text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-text-shimmer'>
                AddWise
              </h2>
            </Link>
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              {!showPasswordFields 
                ? "Enter your email address to reset your password."
                : "Enter your new password below."}
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {!showPasswordFields ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify Email'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="block w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </span>
                    ) : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-10 text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 hover:underline hover:underline-offset-4 transition-all duration-300"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        toastClassName="bg-gray-800 text-white rounded-lg shadow-xl"
        progressClassName="bg-gradient-to-r from-amber-500 to-pink-500"
        bodyClassName="font-medium"
      />
    </div>
  );
};

export default ForgotPassword;