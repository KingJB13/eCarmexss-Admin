import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleReset = async () => {
        try {
            const resetData = { password: password };
            const response = await axios.post(`settings/password/reset?token=${token}`, resetData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                 setMessage('Reset Password Success!');
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
                    <h1 className="text-3xl font-sans text-center mb-6 text-primary-color font-bold">Reset Password</h1>

                    {message && (
                        <div className="bg-green-200 border border-green-500 font-sans text-green-500 p-4 mb-4 rounded-md">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-200 border border-red-500 font-sans text-red-500 p-4 mb-4 rounded-md">
                            {error}
                        </div>
                    )}
                    <p className='py-1 ml-2 font-sans'>Please enter your new password.</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                    />

                    <button
                        onClick={handleReset}
                        className="font-sans w-full bg-primary-color text-white p-3 rounded-md hover:bg-blue-600"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
  )
}

export default ResetPassword