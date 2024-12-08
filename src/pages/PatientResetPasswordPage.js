import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import Swal from 'sweetalert2';

const PatientResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/patients/reset-password', {
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            Swal.fire({
                title: 'Password Reset',
                text: 'Your password has been reset successfully.',
                icon: 'success',
                confirmButtonText: 'Okay',
            }).then(() => {
                navigate('/patient/login');
            });
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const formattedErrors = Object.values(validationErrors).flat().join(' ');
                setError(formattedErrors);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to reset password. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'Okay',
                });
                setError('Failed to reset password. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="h-8 mr-2" src="https://www.sjinnovation.com/sites/default/files/media-icons/favicon.ico" alt="logo" /> SJI Doctor's Appointment Booking
                </Link>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-2xl xl:p-0">
                    <div className="p-6 space-y-4">
                        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Patient Reset Password</h1>
                        {error && (
                            <div className="text-red-500 text-sm mb-4">
                                {error.split('.').map((errMsg, index) => (
                                    <p key={index}>{errMsg}</p>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleResetPassword} className="grid grid-cols-1 sm:grid-cols-1 gap-4 md:gap-6">
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                Back to{' '}
                                <Link to="/patient/login" className="font-medium text-primary-600 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                        <button
                            onClick={() => navigate('/doctor/login')}
                            className="px-3 py-2 bg-blue-600 text-white font-regular rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            Switch to "Doctor's Portal"
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PatientResetPasswordPage;