import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Token');
    
        if (token) {
          navigate("/Home");
        }
      }, [navigate]);
    const handleLogin = async () => {
        try {
            const loginData = { userName: username, password: password };
            const response = await axios.post('auth/login/admin', loginData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200 && response.data.login) {
                const decodedToken = jwtDecode(response.data.login);
                const adminId = decodedToken.nameid || '';
                const role = decodedToken.role || '';

                localStorage.setItem('Token', response.data.login);
                localStorage.setItem('AdminId', adminId);
                localStorage.setItem('Role', role);
                navigate(`/Home`);
            }
        } catch (error) {
            setError(`Error: ${error}`);
        }
    };
    return (
        <div className="relative h-screen bg-gray-background">
            <div className="fixed top-0 left-0 w-full h-[80px] bg-primary-color p-6 z-10">
                <p className="font-sans font-bold text-2xl text-secondary-color">ECARMEXSS</p>
            </div>

            <div className="pt-[80px] h-full flex items-center justify-center">
                <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-md ">
                    <h1 className="text-3xl font-sans text-center mb-6 text-primary-color font-bold">ECARMEXSS ADMIN</h1>
                    {error && (
                        <div className="bg-red-200 border border-red-500 text-red-500 p-4 mb-4 rounded-md">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-secondary-color"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-secondary-color"
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full bg-primary-color text-white p-3 rounded-md hover:bg-hover-color hover:text-white"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>

    );
};

export default LoginScreen;
