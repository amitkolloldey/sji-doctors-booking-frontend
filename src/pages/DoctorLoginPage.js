import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../redux/auth/authSlice';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const DoctorLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (currentUser) {
      await Swal.fire({
        title: 'Switching Role',
        text: 'You will be logged out from your current session.',
        icon: 'warning',
        confirmButtonText: 'Okay',
      });

      dispatch(logout());
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/doctors/login', { email, password });

      if (response.data.token) {

        const doctorData = { ...response.data.doctor, role: 'doctor' };

        dispatch(setUser(doctorData));

        localStorage.setItem('token', response.data.token);

        Swal.fire({
          title: 'Login Successful',
          text: 'You have logged in successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then(() => {
          navigate('/doctor/dashboard');
        });
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const formattedErrors = Object.values(validationErrors).flat().join(' ');
        setError(formattedErrors);
      } else if (err.response && err.response.data.message === 'Email not verified. Please check your email for the verification link.') {
        Swal.fire({
          title: 'Email Not Verified',
          text: 'Please check your email for the verification link and verify your account.',
          icon: 'warning',
          confirmButtonText: 'Okay',
        }).then(() => {
          Swal.fire({
            title: 'Resend Verification Email?',
            text: 'Do you want us to resend the verification link to your email?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Resend',
            cancelButtonText: 'Cancel',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axiosInstance.post('/doctors/resend-verification', { email });
                Swal.fire({
                  title: 'Verification Link Sent',
                  text: 'A new verification link has been sent to your email.',
                  icon: 'success',
                  confirmButtonText: 'Okay',
                });
              } catch (err) {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to resend the verification link. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'Okay',
                });
              }
            }
          });
        });
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid credentials. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className=" h-8 mr-2" src="https://www.sjinnovation.com/sites/default/files/media-icons/favicon.ico" alt="logo" />SJI Doctor's Appointment Booking
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-2xl xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Doctor Login
            </h1>
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error.split('.').map((errMsg, index) => (
                  <p key={index}>{errMsg}</p>
                ))}
              </div>
            )}
            <form onSubmit={handleLogin} className="grid grid-cols-1 sm:grid-cols-1 gap-4 md:gap-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                />

              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="••••••••"
                />

              </div>
              <div className="flex items-center justify-between">
                <Link to="/doctor/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet?{' '}
                <Link to="/doctor/register" className="font-medium text-primary-600 hover:underline">
                  Register here
                </Link>
              </p>
            </form>
            <button
              onClick={() => navigate('/patient/login')}
              className="px-3 py-2 bg-green-600 text-white font-regular rounded-lg shadow-md hover:bg-green-700 transition duration-200"
            >
              Switch to "Patient's Portal"
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorLoginPage;
