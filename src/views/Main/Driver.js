import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChartBar, FaPlus, FaCalendarAlt, FaTrash, FaUserAlt, FaIdCardAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { toast } from 'react-toastify';
const Driver = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const token = localStorage.getItem('Token');
  const [operatorData, setOperatorData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [operatorId,setOperatorId] = useState("");

  useEffect(() => {
    const fetchOperatorData = async () => {
      try {
        const response = await axios.get("website/operator/list", { headers: { 'Authorization': `Bearer ${token}` } }); 
        setOperatorData(response.data); 
      } catch (error) {
        console.error("Error fetching Operator data:", error);
      }
    };

    fetchOperatorData();
  }, [token]); 

  const handleOpenModal = async (e) => {
    setOperatorId(e.target.value)
    setShowConfirmationModal(true);
  }
  const handleCloseModal = () => setShowConfirmationModal(false);

  const handleConfirmationModal = async () => {
    
    try{
      const response = await axios.delete(`website/operator/delete?operatorId=${operatorId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 200) {
        toast.success('Account deleted successfully!');
        setOperatorId("");
        setShowConfirmationModal(false);
        window.location.reload();
    }
    } catch(e){
      toast.error("Error occured in deleting an Operator!")
    }
  };

  const filteredoperatorData = operatorData.filter((operator) =>
    String(operator.jeepneyNumber).includes(searchQuery)
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
      <Sidebar title="ECARMEXSS" menus={menus} indexcount={2} />
      <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
        <p className="p-5 text-xl font-bold">Drivers</p>
        <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
        <div className="w-full flex justify-end mb-4">
            <input
              type="number"
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
                  <th className="py-2 px-4 border-b">Operator ID</th>
                  <th className="py-2 px-4 border-b">Driver Name</th>
                  <th className="py-2 px-4 border-b">Bus No.</th>
                  <th className="py-2 px-4 border-b">Plate No.</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone No.</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredoperatorData.length > 0 ? (
                  filteredoperatorData.map((operator) => (
                    <tr key={operator.operatorId} className="even:bg-gray-200 text-center">
                      <td className="py-2 px-4 border-b">{operator.operatorId}</td>
                      <td className="py-2 px-4 border-b">{operator.user.firstName} {operator.user.lastName}</td>
                      <td className="py-2 px-4 border-b">{operator.jeepneyNumber}</td>
                      <td className="py-2 px-4 border-b">{operator.plateNumber}</td>
                      <td className="py-2 px-4 border-b">{operator.user.email}</td>
                      <td className="py-2 px-4 border-b">{operator.user.phoneNumber}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-500 hover:text-blue-700 ml-2 icon"
                          value={operator.operatorId}
                          onClick={handleOpenModal}
                        >
                          <FaTrash color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No Driver Found.
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
              <p className="text-2xl font-bold mb-5">Delete Account?</p>
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
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Driver;
