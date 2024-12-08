import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/patient/login');
    };

    const getTitle = () => {
        if (user?.role === 'patient') return "Patient's Portal";
        if (user?.role === 'doctor') return "Doctor's Portal";
        return 'Portal';
    };

    return (
        <header className="bg-blue-500 text-white py-4 px-6 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <div className="flex items-center space-x-4">
                <span>Welcome, {user?.name ? user.name : 'User'}!</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
