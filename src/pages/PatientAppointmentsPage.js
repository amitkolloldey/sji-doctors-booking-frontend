import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../redux/appoinments/appointmentsSlice';
import Swal from 'sweetalert2';

const PatientAppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments, loading, error } = useSelector((state) => state.appointments);

    useEffect(() => {
        dispatch(fetchAppointments());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;


    return (
        <div className="space-y-6"> 
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">My Appointments</h2>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Doctor</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Appointment Time</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-center">
                                    No appointments found.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="px-4 py-2">{appointment.doctor.name}</td>
                                    <td className="px-4 py-2">{appointment.date}</td>
                                    <td className="px-4 py-2">{appointment.start_time} - {appointment.end_time}</td>
                                    <td className="px-4 py-2">{appointment.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientAppointmentsPage;
