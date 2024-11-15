import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChartBar, FaPlus, FaCalendarAlt, FaSearch, FaClock, FaUserAlt, FaIdCardAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { toast } from 'react-toastify';

const Trip = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const token = localStorage.getItem('Token');
  const [tripData, setTripData] = useState([]); 
  const [tripId, setTripId] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await axios.get("api/website/trip/list", { headers: { 'Authorization': `Bearer ${token}` } }); 
        setTripData(response.data); 
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, [token]); 

  const handleOpenModal = async (e) => {
    setTripId(e.target.value);
    setShowConfirmationModal(true);
  }

  const handleCloseModal = () => setShowConfirmationModal(false);

  const handleConfirmationModal = async() => {
    try{
      const response = await axios.delete(`website/trip/end?tripId=${tripId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 200) {
        toast.success('Trip ended successfully!');
        setTripId("");
        setShowConfirmationModal(false);
        window.location.reload();
    }
    } catch(e){
      toast.error("Error occured in ending the trip")
    }
  };

  const filteredTripData = tripData.filter((trip) =>
    trip.busNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchBar = (e) => {
    setSearchQuery(e.target.value);
  }
  const menus = [
    { title: "Dashboard", icon: <FaChartBar />, path: "/home" },
    { title: "Register", icon: <FaPlus />, path: "/register" },
    { title: "Driver", icon: <FaIdCardAlt />, path: "/driver" },
    { title: "Conductor", icon: <FaIdCardAlt />, path: "/conductor" },
    { title: "Active Trips", icon: <FaCalendarAlt />, path: "/trip" },
    { title: "Register Conductor", icon: <FaUserAlt />, path: "/register-conductor"}
  ];

  return (
    <div className="flex">
      <Sidebar title="ECARMEXSS" menus={menus} indexcount={4} />
      <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
        <p className="p-5 text-xl font-bold">Active Trips</p>
        
        <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
          <div className="w-full flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search by Bus No."
              value={searchQuery}
              onChange={handleSearchBar}
              className="w-1/3 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="p-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-secondary-color border-b">
                <tr>
                  <th className="py-2 px-4 border-b">Trip ID</th>
                  <th className="py-2 px-4 border-b">Bus No.</th>
                  <th className="py-2 px-4 border-b">Plate No.</th>
                  <th className="py-2 px-4 border-b">Driver Name</th>
                  <th className="py-2 px-4 border-b">Phone Number</th>
                  <th className="py-2 px-4 border-b">Conductor Name</th>
                  <th className="py-2 px-4 border-b">Passenger Count</th>
                  <th className="py-2 px-4 border-b">Availability</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTripData.length > 0 ? (
                  filteredTripData.map((trip) => (
                    <tr key={trip.tripId} className="even:bg-gray-200">
                      <td className="py-2 px-4 border-b">{trip.tripId}</td>
                      <td className="py-2 px-4 border-b">{trip.Operator.jeepneyNumber}</td>
                      <td className="py-2 px-4 border-b">{trip.Operator.plateNumber}</td>
                      <td className="py-2 px-4 border-b">{trip.Operator.User.firstName} {trip.Operator.User.lastName}</td>
                      <td className="py-2 px-4 border-b">{trip.Operator.User.phoneNumber}</td>
                      <td className="py-2 px-4 border-b">{trip.Shift.Conductor.conductorFirstName} {trip.Shift.Conductor.conductorLastName}</td>
                      <td className="py-2 px-4 border-b">{trip.passengerCount}</td>
                      <td className="py-2 px-4 border-b">{trip.Operator.totalCapacity === trip.passengerCount 
                                                          ? 'Full' 
                                                          : trip.Operator.totalCapacity-10 <= trip.passengerCount 
                                                          ? 'Standing': 'Seating'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-500 hover:text-blue-700 icon">
                          <FaSearch />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 ml-2 icon"
                          value={trip.tripId}
                          onClick={handleOpenModal}
                        >
                          <FaClock />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No Trips found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
       
        {showConfirmationModal && (
          <div className="confirmation-modal flex justify-center items-center fixed top-0 left-0 w-full h-full  bg-black bg-opacity-70">
            <div className="confirmation-content bg-white p-20 rounded-lg max-w-sm w-full text-black text-center">
              <p className="text-2xl font-bold mb-5">End Trip?</p>
              <button
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-400 mx-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-gray-700 mx-2"
                onClick={handleConfirmationModal}
              >
                End Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;
