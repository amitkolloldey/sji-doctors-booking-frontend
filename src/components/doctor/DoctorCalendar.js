import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axiosInstance from '../../../src/utils/axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

const DoctorCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axiosInstance.get('/doctors/calendar-data');
                const events = [];
                if (Array.isArray(data.appointments)) {
                    data.appointments.forEach((item) => {
                        events.push({
                            id: item.id,
                            patient_name: item.patient.name,
                            patient_email: item.patient.email,
                            patient_phone: item.patient.phone_no,
                            title: "Appointment",
                            status: item.status,
                            start: new Date(`${item.date}T${item.start_time}`),
                            end: new Date(`${item.date}T${item.end_time}`),
                            type: 'appointment',
                        });
                    });
                }

                if (Array.isArray(data.availability)) {
                    data.availability.forEach((item) => {
                        events.push({
                            id: item.id,
                            title: 'Available Slot',
                            start: new Date(`${item.date}T${item.start_time}`),
                            end: new Date(`${item.date}T${item.end_time}`),
                            type: 'availability',
                        });
                    });
                }

                setEvents(events);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                Swal.fire('Error', 'Could not load calendar data.', 'error');
            }
        };

        fetchEvents();
    }, []);

    const eventPropGetter = (event) => {

        if (event.status === 'canceled') {
            return {
                style: { backgroundColor: '#6c757d', color: 'white', textDecoration: 'line-through' }
            };
        }
        if (event.type === 'appointment') {
            return { style: { backgroundColor: '#dc3545', color: 'white' } };
        }
        if (event.type === 'availability') {
            return { style: { backgroundColor: '#17a2b8', color: 'white' } };
        }
        return {};
    };

    const handleSelectSlot = async ({ start, end }) => {
        const now = moment();
        const selectedStart = moment(start);
        const selectedEnd = moment(end);

        if (selectedStart.isBefore(now) || selectedEnd.isBefore(now)) {
            Swal.fire('Error', 'You cannot select past dates or times.', 'error');
            return;
        }

        const overlappingEvent = events.find(
            (event) =>
                event.type === 'availability' &&
                moment(event.start).isSame(selectedStart, 'day') &&
                ((selectedStart.isBetween(moment(event.start), moment(event.end), undefined, '[)') ||
                    selectedEnd.isBetween(moment(event.start), moment(event.end), undefined, '(]')) ||
                    (selectedStart.isSameOrBefore(moment(event.start)) && selectedEnd.isSameOrAfter(moment(event.end))))
        );

        if (overlappingEvent) {
            Swal.fire(
                'Error',
                'This slot overlaps with an existing availability.',
                'error'
            );
            return;
        }

        const isConfirmed = await Swal.fire({
            title: 'Add Availability',
            text: `Do you want to mark this slot as available?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        if (isConfirmed.isConfirmed) {
            try {
                const response = await axiosInstance.post('/doctors/availability', {
                    date: moment(start).format('YYYY-MM-DD'),
                    slots: [
                        {
                            start_time: moment(start).format('HH:mm:ss'),
                            end_time: moment(end).format('HH:mm:ss'),
                        },
                    ],
                });

                const createdSlots = response.data.slots;

                const newEvents = createdSlots.map((slot) => ({
                    id: slot.id,
                    title: 'Available',
                    start: new Date(`${slot.date}T${slot.start_time}`),
                    end: new Date(`${slot.date}T${slot.end_time}`),
                    type: 'availability',
                }));

                setEvents([...events, ...newEvents]);

                Swal.fire('Success', response.data.message, 'success');
            } catch (error) {
                console.error('Error adding availability:', error);
                Swal.fire(
                    'Error',
                    error.response?.data?.message || 'Could not add slot.',
                    'error'
                );
            }
        }
    };

    const handleEventSelect = async (event) => {
        if (event.type === 'appointment' && event.status === 'canceled') {
            Swal.fire('Info', 'This appointment has been canceled and cannot be modified.', 'info');
            return;
        }

        if (event.type === 'appointment') {
            const now = moment();
            const appointmentStart = moment(event.start);

            if (appointmentStart.isBefore(now)) {
                return;
            }

            const detailsConfirmed = await Swal.fire({
                title: 'Appointment Details',
                html: `
                <div style="font-family: Arial, sans-serif;"> 
                    <p><strong>Patient Name:</strong> ${event.patient_name || 'N/A'}</p>
                    <p><strong>Patient Contact:</strong> ${event.patient_phone || 'N/A'}</p>
                    <p><strong>Patient Email:</strong> ${event.patient_email || 'N/A'}</p>
                    <p><strong>Date:</strong> ${appointmentStart.format('dddd, MMMM Do YYYY, h:mm A')}</p>  
                </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Cancel Appointment',
                cancelButtonText: 'Close',
            });

            if (detailsConfirmed.isConfirmed) {
                const cancelConfirmed = await Swal.fire({
                    title: 'Cancel Appointment',
                    text: 'Are you sure you want to cancel this appointment?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, cancel it',
                    cancelButtonText: 'No',
                });

                if (cancelConfirmed.isConfirmed) {
                    Swal.fire({
                        title: 'Cancelling...',
                        text: 'Please wait while we process your request.',
                        icon: 'info',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        willOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    try {
                        await axiosInstance.patch(`/doctors/appointments/${event.id}/cancel`);
                        setEvents(
                            events.map((e) => { 
                                console.log('Event being processed:', e);
 
                                if (e.id === event.id && e.type === 'appointment' && event.type === 'appointment') {
                                    return { ...e, title: 'Canceled', type: 'appointment', color: '#6c757d', status: 'canceled' };
                                }

                                return e;
                            })
                        ); 
                        Swal.fire('Success', 'The appointment has been canceled.', 'success');
                    } catch (error) {
                        console.error('Error canceling appointment:', error);
                        Swal.fire(
                            'Error',
                            error.response?.data?.message || 'Could not cancel the appointment.',
                            'error'
                        );
                    }
                }
            }
            return;
        }

        if (event.type === 'availability') {
            const isConfirmed = await Swal.fire({
                title: 'Delete Availability',
                text: 'Are you sure you want to delete this availability slot?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'No',
            });

            if (isConfirmed.isConfirmed) {
                try {
                    await axiosInstance.delete(`/doctors/availability/${event.id}`);
                    setEvents(events.filter((e) => e.id !== event.id));
                    Swal.fire('Deleted', 'The availability slot has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting availability:', error);
                    Swal.fire('Error', 'Could not delete the slot.', 'error');
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-#6c757d-100 p-6">
            <div className="flex mb-6">
                <div className="flex items-center mr-6">
                    <div
                        className="w-6 h-6"
                        style={{ backgroundColor: '#dc3545' }}
                    ></div>
                    <span className="ml-2">Appointment</span>
                </div>
                <div className="flex items-center mr-6">
                    <div
                        className="w-6 h-6"
                        style={{ backgroundColor: '#17a2b8' }}
                    ></div>
                    <span className="ml-2">Available Slot</span>
                </div>
                <div className="flex items-center mr-6">
                    <div
                        className="w-6 h-6"
                        style={{ backgroundColor: '#6c757d' }}
                    ></div>
                    <span className="ml-2">Canceled Appointment</span>
                </div>
            </div>
            
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleEventSelect}
                eventPropGetter={eventPropGetter}
                style={{ height: 600 }}
                views={['week', 'day']}
                defaultView="week"
                step={60}
                timeslots={1}
                min={new Date(moment().startOf('day').add(6, 'hours'))}
                max={new Date(moment().startOf('day').add(22, 'hours'))}
                defaultDate={new Date()}
            />
        </div>
    );
};

export default DoctorCalendar;
