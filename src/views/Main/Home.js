import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { FaChartBar, FaPlus, FaCalendarAlt } from "react-icons/fa";

const Home = () => {
    // Retrieve userId from the URL parameters
    const { adminId } = useParams();
    const navigate = useNavigate();

    // Check if userId is null or undefined and log out (redirect) if needed
    useEffect(() => {
        if (!adminId) {
            // If no userId, navigate to login page
            navigate('/');
        }
    }, [adminId, navigate]);

    const menus = [
        { title: "Dashboard", icon: <FaChartBar />, path: `/Home/${adminId}` },
        { title: "Register", icon: <FaPlus />, path: `/Register/${adminId}` },
        { title: "Manage Shifts", icon: <FaCalendarAlt />, path: `/shift/${adminId}` },
    ];

    return (
        <div className='flex'>
            <Sidebar title="ECARMEXSS" menus={menus} indexcount={0} />
            <div>
                <h1>Welcome, User {adminId}</h1>
            </div>
        </div>
    );
};

export default Home;
