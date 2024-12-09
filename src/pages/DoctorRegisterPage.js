import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const DoctorRegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [specializations, setSpecializations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await axiosInstance.get('/doctors/specializations');
                setSpecializations(response.data);
            } catch (err) {
                setError('Error fetching specializations. Please try again later.');
            }
        };

        fetchSpecializations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/doctors/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
                specialization,
            });

            Swal.fire({
                title: 'Success!',
                text: 'Registered successfully! Please check your email for verification.',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            navigate('/doctor/login');
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
                            Doctor Registration
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
                            <div className="col-span-1 sm:col-span-2">
                                <label htmlFor="specialization" className="block mb-2 text-sm font-medium text-gray-900">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="specialization"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map((spec) => (
                                        <option key={spec} value={spec}>
                                            {spec}
                                        </option>
                                    ))}
                                </select>
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
                                <Link to="/doctor/login" className="font-medium text-primary-600 hover:underline">
                                    Login here
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

export default DoctorRegisterPage;
