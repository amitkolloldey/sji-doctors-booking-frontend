import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
    const links = role === 'patient' ? [
        { name: 'Dashboard', path: '/patient/dashboard' }, 
        { name: 'Profile', path: '/patient/profile' },
        { name: 'Appointments', path: '/patient/appointments' },
    ] : [
        { name: 'Dashboard', path: '/doctor/dashboard' },
        { name: 'Profile', path: '/doctor/profile' },
    ];

    return (
        <aside className="w-64 bg-white h-full p-4">

            <nav className="space-y-2">
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) =>
                            `block py-2 px-4 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`
                        }
                        onClick={link.action === 'logout' ? () => localStorage.removeItem('token') : null}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
