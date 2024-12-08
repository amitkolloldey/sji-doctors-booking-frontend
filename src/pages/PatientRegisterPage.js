import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const PatientRegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (phoneNo && phoneNo.length !== 11) {
            setError('Phone number must be 11 digits');
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/patients/register', {
                name,
                email,
                password,
                phone_no: phoneNo
            });

            Swal.fire({
                title: 'Success!',
                text: 'Registered successfully! Please check your email for verification.',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            navigate('/patient/login');
        } catch (err) {
            setLoading(false);

            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const formattedErrors = Object.values(validationErrors).flat().join(' ');
                setError(formattedErrors);
            } else {
                setError('There was an error registering. Please try again later.');
            }

            Swal.fire({
                title: 'Error!',
                text: 'There was an error registering. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img className="h-8 mr-2" src="https://www.sjinnovation.com/sites/default/files/media-icons/favicon.ico" alt="logo" />SJI Doctor's Appointment Booking
                </Link>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-2xl xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Patient Registration
                        </h1>
                        {error && (
                            <div className="text-red-500 text-sm mb-4">
                                {error.split('.').map((errMsg, index) => (
                                    <p key={index}>{errMsg}</p>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="col-span-1">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                    Email Address <span className="text-red-500">*</span>
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
                            <div className="col-span-1">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    Password <span className="text-red-500">*</span>
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
                            <div className="col-span-1">
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="phoneNo" className="block mb-2 text-sm font-medium text-gray-900">
                                    Phone Number (11 Digits)
                                </label>
                                <input
                                    type="text"
                                    id="phoneNo"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    required
                                    maxLength={11}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Your phone number"
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <button
                                    type="submit"
                                    className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                            <p className="text-sm font-light text-gray-500">
                                Already have an account?{' '}
                                <Link to="/patient/login" className="font-medium text-primary-600 hover:underline">
                                    Login here
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

export default PatientRegisterPage;
