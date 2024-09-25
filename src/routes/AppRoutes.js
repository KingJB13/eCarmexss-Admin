import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginScreen from '../views/Login';
import ResetPassword from '../views/ResetPassword';
import Home from '../views/Main/Home';
import Register from '../views/Main/Register';
import Shift from '../views/Main/Shift';

function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shift" element={<Shift />} />

            </Routes>
        </>
    );
}

export default AppRoutes;