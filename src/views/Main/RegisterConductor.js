import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaChartBar, FaPlus, FaCalendarAlt, FaUserAlt, FaIdCardAlt } from "react-icons/fa";
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const RegisterConductor = () => {
  const menus = [
    { title: "Dashboard", icon: <FaChartBar />, path: "/home" },
    { title: "Register", icon: <FaPlus />, path: "/register" },
    { title: "Driver", icon: <FaIdCardAlt />, path: "/driver" },
    { title: "Conductor", icon: <FaIdCardAlt />, path: "/conductor" },
    { title: "Active Trips", icon: <FaCalendarAlt />, path: "/trip" },
    { title: "Register Conductor", icon: <FaUserAlt />, path: "/register-conductor"}
  ];
  
  const [formData, setFormData] = useState({
    conductorFirstName: '',
    conductorLastName: '',
    conductorEmail: '',
    conductorPhoneNumber: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'conductorEmail':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.conductorEmail = 'Invalid email format.';
        } else {
          delete newErrors.conductorEmail;
        }
        break;
      case 'conductorFirstName':
        if (/\d/.test(value)) {
          newErrors.conductorFirstName = 'Names cannot contain numbers.';
        } else {
          delete newErrors.conductorFirstName;
        }
        break;
      case 'conductorLastName':
        if (/\d/.test(value)) {
          newErrors.conductorLastName = 'Names cannot contain numbers.';
        } else {
          delete newErrors.conductorLastName;
        }
        break;
      case 'conductorPhoneNumber':
        if (!/^09\d{9}$/.test(value)) {
          newErrors.conductorPhoneNumber = 'Invalid phone number format.';
        } else {
          delete newErrors.conductorPhoneNumber;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: value
      };
      validateField(name, value);
      return updatedFormData;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
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
      const response = await axios.post('shift/conductor/add', formData, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 200) {
        setFormData({
          conductorFirstName: '',
          conductorLastName: '',
          conductorEmail: '',
          conductorPhoneNumber: '',
        })
        toast.success('Conducterd registered successfully!');
      }
    } catch (error) {
      toast.error('Error occured in registering a conductor');
    }
  };

  return (
    <div className='flex'>
      <Sidebar title="ECARMEXSS" menus={menus} indexcount={5} />
      <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
        <p className='px-5 py-2 text-xl font-bold'>Register a Conductor</p>
        <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
          <div className="space-y-0 sm:space-y-2">
            <div>
              <h2 className="text-gray-700 font-semibold text-lg mb-1">Conductor Details</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 mb-5">
                <div>
                  <label className="text-gray-700 text-sm mb-1 block">First Name</label>
                  <input name="conductorFirstName" type="text" onChange={handleChange} value={formData.conductorFirstName} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter First Name" required />
                  {errors.conductorFirstName && <span className="text-red-500 text-sm">{errors.conductorFirstName}</span>}
                </div>
                <div>
                  <label className="text-gray-700 text-sm mb-1 block">Last Name</label>
                  <input name="conductorLastName" type="text" onChange={handleChange} value={formData.conductorLastName} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter Last Name" required />
                  {errors.conductorLastName && <span className="text-red-500 text-sm">{errors.conductorLastName}</span>}
                </div>
                <div>
                  <label className="text-gray-700 text-sm mb-1 block">Email</label>
                  <input name="conductorEmail" type="email" onChange={handleChange} value={formData.conductorEmail} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter Email" required />
                  {errors.conductorEmail && <span className="text-red-500 text-sm">{errors.conductorEmail}</span>}
                </div>
                <div>
                  <label className="text-gray-700 text-sm mb-1 block">Phone Number</label>
                  <input name="conductorPhoneNumber" type="text" onChange={handleChange} value={formData.conductorPhoneNumber} className="text-gray-700 bg-gray-200 border border-gray-300 w-full text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-600" placeholder="Enter Phone Number" required />
                  {errors.conductorPhoneNumber && <span className="text-red-500 text-sm">{errors.conductorPhoneNumber}</span>}
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
  )
}

export default RegisterConductor;
