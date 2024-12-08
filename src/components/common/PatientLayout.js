import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const PatientLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar role="patient" />
                <main className="flex-1 bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;
