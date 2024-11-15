import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginScreen from '../views/Login';
import ResetPassword from '../views/ResetPassword';
import Home from '../views/Main/Home';
import Register from '../views/Main/Register';
import RegisterConductor from '../views/Main/RegisterConductor';
import Trip from '../views/Main/Trip';
import Driver from '../views/Main/Driver';
import NotFound from '../views/Main/NotFound';
import Conductor from '../views/Main/Conductor';

function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/driver" element={<Driver />} />
                <Route path="/conductor" element={<Conductor />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/register" element={<Register />} />
                <Route path="/trip" element={<Trip />} />
                <Route path="/register-conductor" element={<RegisterConductor/>} />
                

            </Routes>
        </>
    );
}

export default AppRoutes;