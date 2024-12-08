import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/auth/authSlice';
import Swal from 'sweetalert2';
import axiosInstance from '../utils/axios';

const DoctorProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user.name || '', 
        specialization: user.specialization || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [error, setError] = useState('');

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(updateProfile(formData));
            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            });
        } catch (error) {
            console.error('Failed to update profile:', error);

            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating the profile.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{user.name}'s Profile</h2>
                {error && (
                    <div className="text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div> 
                    <div>
                        <label className="block text-gray-700 font-medium">Specialization</label>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Specialization</option>
                            {specializations.length > 0 ? (
                                specializations.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading specializations...</option>
                            )}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
