import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Welcome to SJI Doctor's Appointment Booking System
            </h1>
            <p className="text-lg text-gray-600 mb-8">Please select your portal:</p>
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate('/doctor/login')}
                    className="px-3 py-2 bg-blue-600 text-white font-regular rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                    Go to "Doctor's Portal"
                </button>
                <button
                    onClick={() => navigate('/patient/login')}
                    className="px-3 py-2 bg-green-600 text-white font-regular rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                >
                    Go to "Patient's Portal"
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
