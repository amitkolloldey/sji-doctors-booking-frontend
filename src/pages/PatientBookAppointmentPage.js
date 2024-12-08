import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';

const PatientBookAppointmentPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [availability, setAvailability] = useState({});
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const patient = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchDoctorAndAvailability = async () => {
            try {
                const availabilityResponse = await axiosInstance.get(`/doctors/availability/${doctorId}`);
                const { availability, bookedAppointments, doctor } = availabilityResponse.data;
                setAvailability(formatAvailability(availability, bookedAppointments));
                setDoctor(doctor)
            } catch (error) {
                console.error('Error fetching doctor or availability:', error);
                Swal.fire('Error', 'Could not fetch doctor details or availability.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAndAvailability();
    }, [doctorId]);

    const formatAvailability = (availabilityData, bookedAppointments) => {
        let grouped = {};

        Object.keys(availabilityData).forEach((date) => {
            grouped[date] = [];

            availabilityData[date].forEach((slot) => {
                const slotStart = moment(`${slot.date} ${slot.start_time}`, 'YYYY-MM-DD HH:mm:ss');
                const slotEnd = moment(`${slot.date} ${slot.end_time}`, 'YYYY-MM-DD HH:mm:ss');


                let currentSlotStart = slotStart.clone();
                while (currentSlotStart.isBefore(slotEnd)) {
                    const nextSlotStart = currentSlotStart.clone().add(1, 'hour');
                    grouped[date].push({
                        id: `${slot.id}-${currentSlotStart.format('HH:mm')}`,
                        date: slot.date,
                        start_time: currentSlotStart.format('HH:mm:ss'),
                        end_time: nextSlotStart.isBefore(slotEnd)
                            ? nextSlotStart.format('HH:mm:ss')
                            : slotEnd.format('HH:mm:ss'),
                    });
                    currentSlotStart = nextSlotStart;
                }
            });


            const bookedSlots = bookedAppointments[date] || [];
            grouped[date] = grouped[date].filter((slot) => {
                return !bookedSlots.some(
                    (booked) =>
                        booked.start_time === slot.start_time &&
                        booked.end_time === slot.end_time
                );
            });
        });

        return grouped;
    };



    const handleBooking = async () => {
        if (!selectedSlot) {
            Swal.fire('Error', 'Please select a time slot to book an appointment.', 'error');
            return;
        }
        if (!patient) {
            Swal.fire('Error', 'Patient not authenticated.', 'error');
            return;
        }

        setIsBooking(true);

        try {
            await axiosInstance.post('/doctors/appointments', {
                doctor_id: doctorId,
                patient_id: patient.id,
                date: selectedSlot.date,
                start_time: selectedSlot.start_time,
                end_time: selectedSlot.end_time,
                status: 'pending',
            });

            Swal.fire('Success', 'Your appointment has been booked!', 'success');
            navigate('/patient/dashboard');
        } catch (error) {
            console.error('Error booking appointment:', error);
            Swal.fire('Error', 'Could not book the appointment.', 'error');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">

                <h2 className="text-2xl font-bold text-gray-800 mb-8">Book an Appointment with {doctor.name}</h2>

                <div className="mb-6">


                    {Object.keys(availability).length === 0 ? (
                        <p className="text-center text-gray-600">No available slots</p>
                    ) : (
                        Object.keys(availability).map((date) => (
                            availability[date].length > 0 && (
                                <div key={date} className="mb-6">
                                    <h3 className="font-semibold text-lg mb-3">{new Date(date).toLocaleDateString()}</h3>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {availability[date].map((slot) => (
                                            <div
                                                key={slot.id}
                                                className={`p-4 bg-gray-200 rounded-md cursor-pointer shadow-md hover:bg-blue-100 transition ${selectedSlot?.id === slot.id && 'border-2 border-blue-500'
                                                    }`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                <p className="text-center font-medium">
                                                    {slot.start_time} - {slot.end_time}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>


                {selectedSlot && (
                    <div className="bg-blue-100 p-6 rounded-md mb-6 shadow-lg">
                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Selected Slot</h3>
                        <div className="text-lg">
                            <p className="text-gray-700 mb-2">
                                <strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Time:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">You have selected the slot above. If everything looks good, click the button to book the appointment.</p>
                    </div>
                )}

                <div className="text-center">
                    <button
                        onClick={handleBooking}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        disabled={isBooking}
                    >
                        {isBooking ? 'Booking...' : 'Book Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientBookAppointmentPage;
