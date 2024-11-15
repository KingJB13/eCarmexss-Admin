import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaChartBar, FaPlus, FaCalendarAlt, FaUserAlt, FaIdCardAlt } from "react-icons/fa";
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        operators: {
            jeepneyNumber: '',
            plateNumber: '',
            totalCapacity: '',
            standingCapacity: ''
        },
        signup: {
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            birthday: ''
        }
    });

    const [errors, setErrors] = useState({});

    const menus = [
        { title: "Dashboard", icon: <FaChartBar />, path: "/home" },
        { title: "Register", icon: <FaPlus />, path: "/register" },
        { title: "Driver", icon: <FaIdCardAlt />, path: "/driver" },
        { title: "Conductor", icon: <FaIdCardAlt />, path: "/conductor" },
        { title: "Active Trips", icon: <FaCalendarAlt />, path: "/trip" },
        { title: "Register Conductor", icon: <FaUserAlt />, path: "/register-conductor"}
      ];

    const validateField = (section, field, value) => {
        const newErrors = { ...errors };

        switch (section) {
            case 'signup':
                switch (field) {
                    case 'username':
                        if (!value || value.length < 6 || value.length > 12) {
                            newErrors.username = 'Username must be 6 to 12 characters long.';
                        } else {
                            delete newErrors.username;
                        }
                        break;
                    case 'password':
                        if (!value || value.length < 8 || value.length > 32) {
                            newErrors.password = 'Password must be 8 to 32 characters long.';
                        } else {
                            delete newErrors.password;
                        }
                        break;
                    case 'confirmPassword':
                        if (value !== formData.signup.password) {
                            newErrors.confirmPassword = 'Passwords do not match.';
                        } else {
                            delete newErrors.confirmPassword;
                        }
                        break;
                    case 'email':
                        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                            newErrors.email = 'Invalid email format.';
                        } else {
                            delete newErrors.email;
                        }
                        break;
                    case 'firstName':
                        if (/\d/.test(value)) {
                            newErrors.firstName = 'Names cannot contain numbers.';
                        } else {
                            delete newErrors.firstName;
                        }
                        break;
                    case 'lastName':
                        if (/\d/.test(value)) {
                            newErrors.lastName = 'Names cannot contain numbers.';
                        } else {
                            delete newErrors.lastName;
                        }
                        break;
                    case 'phoneNumber':
                        if (!/^09\d{9}$/.test(value)) {
                            newErrors.phoneNumber = 'Invalid phone number format.';
                        } else {
                            delete newErrors.phoneNumber;
                        }
                        break;
                    case 'birthday':
                        const today = new Date();
                        const birthDate = new Date(value);
                        const age = today.getFullYear() - birthDate.getFullYear();
                        const monthDifference = today.getMonth() - birthDate.getMonth();
                        const dayDifference = today.getDate() - birthDate.getDate();
    
                        if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
                            newErrors.birthday = 'You must be at least 13 years old.';
                        } else {
                            delete newErrors.birthday;
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 'operators':
                switch (field) {
                    case 'jeepneyNumber':
                        if (!value) {
                            newErrors.jeepneyNumber = "Jeepney Number is required.";
                        } else {
                            delete newErrors.jeepneyNumber;
                        }
                        break;
                    case 'plateNumber':
                        if (!value) {
                            newErrors.plateNumber = "Plate Number is required.";
                        } else {
                            delete newErrors.plateNumber;
                        }
                        break;
                    case 'totalCapacity':
                        if (!value || isNaN(value)) {
                            newErrors.totalCapacity = "Total Capacity must be a number.";
                        } else {
                            delete newErrors.totalCapacity;
                        }
                        break;
                    case 'standingCapacity':
                        if (!value || isNaN(value)) {
                            newErrors.standingCapacity = "Standing Capacity must be a number.";
                        } else {
                            delete newErrors.standingCapacity;
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        setFormData((prevState) => {
            const updatedFormData = {
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: value
                }
            };

            validateField(section, field, value);

            return updatedFormData;
        });
    };
    const validateForm = () => {
        const newErrors = {};

        // Validate all fields in the form
        Object.keys(formData.signup).forEach(field => {
            validateField('signup', field, formData.signup[field]);
        });
        Object.keys(formData.operators).forEach(field => {
            validateField('operators', field, formData.operators[field]);
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('Token');
            const response = await axios.post('auth/signup/operator', formData, {headers: {'Authorization': `Bearer ${token}`}});
            console.log('Response:', response.data);
            toast.success('Account created successfully!');
        } catch (error) {
            toast.error('error occured in creating an operator account');
        }
    };

    return (
        <div className='flex'>
            <Sidebar title="ECARMEXSS" menus={menus} indexcount={1} />
            <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
                <p className='px-5 py-2 text-xl font-bold'>Register an Operator Account</p>
                <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
                    <div className="space-y-0 sm:space-y-2">
                        <div>
                            <label className="text-gray-700 text-sm mb-1 block">Username</label>
                            <input name="signup.username" type="text" onChange={handleChange} value={formData.signup.username} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter username" required/>
                            {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-gray-700 text-sm mb-1 block">Password</label>
                                <input name="signup.password" type="password" onChange={handleChange} value={formData.signup.password} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter password" required/>
                                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                            </div>
                            <div>
                                <label className="text-gray-700 text-sm mb-1 block">Confirm Password</label>
                                <input name="signup.confirmPassword" type="password" onChange={handleChange} value={formData.signup.confirmPassword} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Confirm password" required/>
                                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-gray-700 text-sm mb-1 block">First Name</label>
                            <input name="signup.firstName" type="text" onChange={handleChange} value={formData.signup.firstName} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter first name" required/>
                            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm mb-1 block">Last Name</label>
                            <input name="signup.lastName" type="text" onChange={handleChange} value={formData.signup.lastName} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter last name" required/>
                            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm mb-1 block">Email</label>
                            <input name="signup.email" type="email" onChange={handleChange} value={formData.signup.email} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter email" required/>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-gray-700 text-sm mb-1 block">Phone Number</label>
                                <input name="signup.phoneNumber" type="tel" onChange={handleChange} value={formData.signup.phoneNumber} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter phone number" required/>
                                {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
                            </div>
                            <div>
                                <label className="text-gray-700 text-sm mb-1 block">Birthday</label>
                                <input name="signup.birthday" type="date" onChange={handleChange} value={formData.signup.birthday} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" required/>
                                {errors.birthday && <span className="text-red-500 text-sm">{errors.birthday}</span>}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-gray-700 font-semibold text-lg mb-1">Operator Details</h2>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 mb-5">
                                <div>
                                    <label className="text-gray-700 text-sm mb-1 block">Jeepney Number</label>
                                    <input name="operators.jeepneyNumber" type="text" onChange={handleChange} value={formData.operators.jeepneyNumber} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter jeepney number" required/>
                                    {errors.jeepneyNumber && <span className="text-red-500 text-sm">{errors.jeepneyNumber}</span>}
                                </div>
                                <div>
                                    <label className="text-gray-700 text-sm mb-1 block">Plate Number</label>
                                    <input name="operators.plateNumber" type="text" onChange={handleChange} value={formData.operators.plateNumber} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter plate number" required/>
                                    {errors.plateNumber && <span className="text-red-500 text-sm">{errors.plateNumber}</span>}
                                </div>
                                <div>
                                    <label className="text-gray-700 text-sm mb-1 block">Total Capacity</label>
                                    <input name="operators.totalCapacity" type="number" onChange={handleChange} value={formData.operators.totalCapacity} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter total capacity" required/>
                                    {errors.totalCapacity && <span className="text-red-500 text-sm">{errors.totalCapacity}</span>}
                                </div>
                                <div>
                                    <label className="text-gray-700 text-sm mb-1 block">Standing Capacity</label>
                                    <input name="operators.standingCapacity" type="number" onChange={handleChange} value={formData.operators.standingCapacity} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter standing capacity" required/>
                                    {errors.standingCapacity && <span className="text-red-500 text-sm">{errors.standingCapacity}</span>}
                                </div>
                            </div>
                        </div>

                        <button onClick={handleSubmit} className="w-full py-2 px-4 text-sm tracking-wider font-semibold rounded-md text-black bg-secondary-color hover:bg-[#d39a27] focus:outline-none focus:ring-2 focus:ring-gray-600">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
