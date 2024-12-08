import React from 'react'; 
const GuestLayout = ({ children }) => {
    return (
        <div> 
            <main className="guest-content">{children}</main>
        </div>
    );
};

export default GuestLayout;