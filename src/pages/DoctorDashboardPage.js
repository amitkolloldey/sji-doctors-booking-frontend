import React from 'react';
import DoctorCalendar from '../components/doctor/DoctorCalendar';
import { useSelector } from 'react-redux';

const DoctorDashboardPage = () => {
    const user = useSelector((state) => state.auth.user); 

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{user.name}'s Calendar</h2> 
                <DoctorCalendar />
            </div>
        </div>
    );
};

export default DoctorDashboardPage;
