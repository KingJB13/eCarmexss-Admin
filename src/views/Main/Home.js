import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'
import { FaChartBar, FaPlus, FaUserAlt, FaIdCardAlt, FaIdCard, FaUser, FaInfoCircle, FaMoneyBill } from "react-icons/fa"
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const Home = () => {
        const navigate = useNavigate();
        const handleDriverNavigate = () => {
            navigate('/driver');
        }
        const handleConductorNavigate = () => {
            navigate('/conductor');
        }
        const token = localStorage.getItem('Token');
        useEffect(() => {
            const fetchOperatorData = async () => {
              try {
                const response = await axios.get("website/dashboard/get", { headers: { 'Authorization': `Bearer ${token}` } }); 
                setDashboardData(response.data); 
              } catch (error) {
                console.error("Error fetching Operator Data");
              }
            };
        
            fetchOperatorData();
          }, [token]); 
          const [logData, setLogData] = useState({
            tickets : [],
            bookings : [],
            waitingPassengers: []
          });
          useEffect(() => {
            const fetchLogData = async () => {
              try {
                const response = await axios.get("website/logs/data", { headers: { 'Authorization': `Bearer ${token}` } }); 
                setLogData(response.data); 
              } catch (error) {
                console.error("Error fetching Log data");
              }
            };
        
            fetchLogData();
            const interval = setInterval(fetchLogData, 60000);

    
            return () => clearInterval(interval);
          }, [token]); 

        const [formData, setFormData] = useState({
            baseCost: '',
            exceedingCost: '',
            discount: '',
            reservationFee: '',
            waitingPassengerFee: ''
        });
        const [dashboardData, setDashboardData] = useState({
            cost : {
                baseCost: 0,
                exceedingCost: 0,
                reservationFee: 0,
                waitingPassengerFee: 0
            },
            totalDrivers: 0,
            totalConductors: 0,
            dailyRevenue: 0,
            bookingRevenue: 0,
            waitingPassengerRevenue: 0
        });
        const [errors, setErrors] = useState({});

        const handleChange = (e) => {
            const { name, value } = e.target;
            if (!/^\d*\.?\d*$/.test(value)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: 'Please enter a valid number'
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: ''
                }));
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value
                }));
            }
        };
        
        const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
        
            return `${month}-${day}-${year} ${hours}:${minutes}`;
        };
        
        // Example usage
        console.log(formatDateTime("2024-11-18T14:30:00"));
        
        const handleSubmit = async (e) => {
            e.preventDefault();
            const newErrors = {};
            

            Object.keys(formData).forEach(key => {
                if (formData[key] && isNaN(formData[key])) {
                    newErrors[key] = 'Please enter a valid number';
                } else if (!formData[key]) {
                    newErrors[key] = 'This field is required';
                }
            });
        
            setErrors(newErrors);
        
            if (Object.keys(newErrors).length === 0) {
                try{
                    const response = await axios.post('cost/update', formData, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.status === 200) {
                    toast.success('Cost updated successfully!');
                    }
                } catch (e){
                    toast.error("Error in updating the cost")
                }
            }
        };
        
    const menus = [
            { title: "Dashboard", icon: <FaChartBar />, path: "/home" },
            { title: "Register", icon: <FaPlus />, path: "/register" },
            { title: "Driver", icon: <FaIdCardAlt />, path: "/driver" },
            { title: "Conductor", icon: <FaIdCardAlt />, path: "/conductor" },
            { title: "Register Conductor", icon: <FaUserAlt />, path: "/register-conductor"}
          ];
  return ( 
    <div className='flex'>
        <Sidebar title="ECARMEXSS" menus={menus} indexcount={0} />
        <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-1 bg-white p-4 border border-gray-300 rounded-md">
                            <h2 className="font-bold mb-4">Update Costing</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label className="block text-sm">Base Cost</label>
                                    <input
                                        type="text"
                                        name="baseCost"
                                        value={formData.baseCost}
                                        onChange={handleChange}
                                        placeholder="Enter base cost"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.baseCost && <p className="text-red-500 text-xs">{errors.baseCost}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Exceeding Cost</label>
                                    <input
                                        type="text"
                                        name="exceedingCost"
                                        value={formData.exceedingCost}
                                        onChange={handleChange}
                                        placeholder="Enter exceeding cost"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.exceedingCost && <p className="text-red-500 text-xs">{errors.exceedingCost}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Discount</label>
                                    <input
                                        type="text"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        placeholder="Enter discount"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.discount && <p className="text-red-500 text-xs">{errors.discount}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm">Reservation Fee</label>
                                    <input
                                        type="text"
                                        name="reservationFee"
                                        value={formData.reservationFee}
                                        onChange={handleChange}
                                        placeholder="Enter reservation fee"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.reservationFee && <p className="text-red-500 text-xs">{errors.reservationFee}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text -sm">Waiting Passenger Fee</ label>
                                    <input
                                        type="text"
                                        name="waitingPassengerFee"
                                        value={formData.waitingPassengerFee}
                                        onChange={handleChange}
                                        placeholder="Enter waiting passenger fee"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.waitingPassengerFee && <p className="text-red-500 text-xs">{errors.waitingPassengerFee}</p>}
                                </div>
                                <button type="submit" className="w-full bg-secondary-color text-black p-2 rounded-md">Update Costing</button>
                            </form>
                        </div>
                        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-500 p-4 border border-blue-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors" onClick={()=>{}}>
                                <div className="text-white">
                                    <div className='grid grid-cols-2 text-start'>
                                        <div className='px-10 text-center py-5'><FaInfoCircle size={50}/> </div>
                                        <div>
                                            <div className="text-xl font-bold text-black">Fees in Peso:</div>
                                            <div className="text-s font-normal text-white">Base: {dashboardData.cost.baseCost} PHP</div>
                                            <div className="text-s font-normal text-white">Exceeding: {dashboardData.cost.exceedingCost} PHP</div>
                                            <div className="text-s font-normal text-white">Reservation: {dashboardData.cost.reservationFee} PHP</div>
                                            <div className="text-s font-normal text-white">Waiting Passenger: {dashboardData.cost.waitingPassengerFee} PHP</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="bg-green-500 p-4 border border-green-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors" onClick={handleDriverNavigate}>
                                    <div className="px-10 text-white">
                                        <div className="grid grid-cols-2">
                                            <div className="text-center">
                                                <FaUser size={50} />
                                            </div>
                                            <div>
                                                <div className="text-3xl">{dashboardData.totalDrivers}</div>
                                                <div className="text-m font-medium text-white">Total Drivers</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-500 p-4 border border-yellow-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors" onClick={handleConductorNavigate}>
                                    <div className="px-10 text-white">
                                        <div className="grid grid-cols-2">
                                            <div className="text-center">
                                                <FaIdCard size={50} />
                                            </div>
                                            <div>
                                                <div className="text-3xl">{dashboardData.totalConductors}</div>
                                                <div className="text-m font-medium text-white">Total Conductors</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className="col-span-1  bg-red-500 p-4 border border-red-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors" onClick={()=>{}}>
                                <div className="px-10 text-white">
                                    <div className='grid grid-cols-2'>
                                        <div className='text-center'><FaMoneyBill size={50}/> </div>
                                        <div>
                                            <div className="text-3xl">{dashboardData.dailyRevenue} PHP</div>
                                            <div className="text-m font-medium text-white">Daily Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-500 p-4 border border-purple-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors" onClick={()=>{}}>
                                <div className="px-10 text-white">
                                        <div className='grid grid-cols-2'>
                                            <div className='text-center'><FaMoneyBill size={50}/> </div>
                                            <div>
                                                <div className="text-3xl">{dashboardData.bookingRevenue} PHP</div>
                                                <div className="text-m font-medium text-white">Booking Revenue</div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="bg-pink-500 p-4 border border-pink-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors" onClick={()=>{}}>
                                <div className="px-10 text-white">
                                    <div className='grid grid-cols-2'>
                                        <div className='text-center'><FaMoneyBill size={50}/> </div>
                                        <div>
                                            <div className="text-3xl">{dashboardData.waitingPassengerRevenue} PHP</div>
                                            <div className="text-m font-medium text-white">Waiting Passenger Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white p-4 border border-gray-300 rounded-md">
                            <h2 className="font-bold mb-4">Ticket Logs</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white border border-gray-300 rounded-lg">
                                    <thead className="bg-secondary-color border-b">
                                        <tr>
                                        <th className="py-2 px-4 border-b">Bus No.</th>
                                        <th className="py-2 px-4 border-b">Origin</th>
                                        <th className="py-2 px-4 border-b">Destination</th>
                                        <th className="py-2 px-4 border-b">Price</th>
                                        <th className="py-2 px-4 border-b">Date and Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logData.tickets.length > 0 ? (
                                            logData.tickets.map((ticket, index) => (
                                            <tr key={index} className="even:bg-gray-200">
                                                <td className="py-2 px-4 border-b">{ticket.jeepneyNumber}</td>
                                                <td className="py-2 px-4 border-b">{ticket.originName}</td>
                                                <td className="py-2 px-4 border-b">{ticket.destinationName}</td>
                                                <td className="py-2 px-4 border-b">{ticket.amount}</td>
                                                <td className="py-2 px-4 border-b">{formatDateTime(ticket.dateTime)}</td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                            <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                                No tickets available
                                            </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        < div className="bg-white p-4 border border-gray-300 rounded-md">
                            <h2 className="font-bold mb-4 ">Booking Logs</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white border border-gray-300 rounded-lg">
                                    <thead className="bg-secondary-color border-b">
                                        <tr>
                                        <th className="py-2 px-4 border-b">Bus No.</th>
                                        <th className="py-2 px-4 border-b">Origin</th>
                                        <th className="py-2 px-4 border-b">Destination</th>
                                        <th className="py-2 px-4 border-b">Price</th>
                                        <th className="py-2 px-4 border-b">Date and Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logData.bookings.length > 0 ? (
                                            logData.bookings.map((booking, index) => (
                                            <tr key={index} className="even:bg-gray-200">
                                                <td className="py-2 px-4 border-b">{booking.jeepneyNumber}</td>
                                                <td className="py-2 px-4 border-b">{booking.originName}</td>
                                                <td className="py-2 px-4 border-b">{booking.destinationName}</td>
                                                <td className="py-2 px-4 border-b">{booking.amount}</td>
                                                <td className="py-2 px-4 border-b">{formatDateTime(booking.dateTime)}</td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                            <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                                No booking available
                                            </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-gray-300 rounded-md">
                            <h2 className="font-bold mb-4">Waiting Passenger Logs</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white border border-gray-300 rounded-lg">
                                    <thead className="bg-secondary-color border-b">
                                        <tr>
                                        <th className="py-2 px-4 border-b">Bus No.</th>
                                        <th className="py-2 px-4 border-b">Origin</th>
                                        <th className="py-2 px-4 border-b">Destination</th>
                                        <th className="py-2 px-4 border-b">Price</th>
                                        <th className="py-2 px-4 border-b">Date and Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logData.waitingPassengers.length > 0 ? (
                                            logData.waitingPassengers.map((waiting, index) => (
                                            <tr key={index} className="even:bg-gray-200">
                                                <td className="py-2 px-4 border-b">{waiting.jeepneyNumber}</td>
                                                <td className="py-2 px-4 border-b">{waiting.originName}</td>
                                                <td className="py-2 px-4 border-b">{waiting.destinationName}</td>
                                                <td className="py-2 px-4 border-b">{waiting.amount}</td>
                                                <td className="py-2 px-4 border-b">{formatDateTime(waiting.dateTime)}</td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                            <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                                No Waiting Passenger available
                                            </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            
    </div>
    )
}

export default Home