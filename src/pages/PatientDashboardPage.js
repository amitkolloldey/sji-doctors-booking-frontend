// src/pages/PatientDashboardPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboardPage = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get('/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Available Doctors</h2>
                <ul className="mt-4 space-y-4">
                    {doctors.length === 0 ? (
                        <p>No doctors available at the moment.</p>
                    ) : (
                        doctors.map((doctor) => (
                            <li key={doctor.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                        <p className="text-gray-600">{doctor.specialization}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/patient/book-appointment/${doctor.id}`)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PatientDashboardPage;
