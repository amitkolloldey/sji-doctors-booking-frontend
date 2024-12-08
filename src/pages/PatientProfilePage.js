import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/auth/authSlice';
import Swal from 'sweetalert2';

const PatientProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone_no: user.phone_no || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false); 

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
              
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Full Name</label>
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
                        <label className="block text-gray-700 font-medium">Phone Number</label>
                        <input
                            type="text"
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                            maxLength={11}
                        />
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

export default PatientProfilePage;
