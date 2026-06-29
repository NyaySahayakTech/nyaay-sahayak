import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                ⚖️ Nyaay Sahayak
            </Link>

            <div className="space-x-4">
                <Link to="/analyze" className="text-gray-600 hover:text-blue-500 font-medium">Analyze</Link>
                <Link to="/history" className="text-gray-600 hover:text-blue-500 font-medium">History</Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Login
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
