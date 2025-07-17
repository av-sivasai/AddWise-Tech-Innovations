import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '../redux/user/user.slice';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }
      dispatch(setUser(data.user))
      toast.success("Login successful! Redirecting...");
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setTimeout(() => navigate('/user'), 2000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4'>
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01] border border-gray-700">
        <div className="p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link to='/'>
              <h2 className='text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-text-shimmer'>
                AddWise
              </h2>
            </Link>
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
              Login to your account
            </h2>
            <div className="mt-2 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    placeholder='Enter your password'
                    type="password"
                    value={password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:underline transition-all duration-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : 'Login'}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              I don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 hover:underline transition-all duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast notification container */}
      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        theme="dark"
        toastClassName="bg-gray-800 border border-gray-700 rounded-lg"
        progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );
};

export default Login;