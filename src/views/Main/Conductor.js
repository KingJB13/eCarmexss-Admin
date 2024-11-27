import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChartBar, FaPlus, FaTrash, FaUserAlt, FaIdCardAlt } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { toast } from 'react-toastify';
const Conductor = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const token = localStorage.getItem('Token');
  const [conductorData, setConductorData] = useState([]); 
  const [conductorId,setConductorId] = useState("");

  useEffect(() => {
    const fetchConductorData = async () => {
      try {
        const response = await axios.get("website/conductor/list", { headers: { 'Authorization': `Bearer ${token}` } }); 
        setConductorData(response.data); 
      } catch (error) {
        console.error("Error fetching Operator data:", error);
      }
    };

    fetchConductorData();
  }, [token]); 

  const handleOpenModal = async (e) => {
    setConductorId(e)
    setShowConfirmationModal(true);
  }
  const handleCloseModal = () => setShowConfirmationModal(false);

  const handleConfirmationModal = async () => {
    
    try{
      const response = await axios.delete(`website/conductor/delete?conductorId=${conductorId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.status === 200) {
        toast.success('Conductor deleted successfully!');
        setConductorId("");
        setShowConfirmationModal(false);
        window.location.reload();
    }
    } catch(e){
      toast.error("Error occured in deleting a conductor!")
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
    <div className="flex">
      <Sidebar title="ECARMEXSS" menus={menus} indexcount={3} />
      <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
        <p className="p-5 text-xl font-bold">Conductors</p>
        <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
          <div className="p-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-secondary-color border-b">
                <tr>
                  <th className="py-2 px-4 border-b">Conductor ID</th>
                  <th className="py-2 px-4 border-b">Conductor Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone No.</th>
                  <th className="py-2 px-4 border-b">Actions</th>

                </tr>
              </thead>
              <tbody>
                {conductorData.length > 0 ? (
                  conductorData.map((conductor) => (
                    <tr key={conductor.conductorId} className="even:bg-gray-200 text-center">
                      <td className="py-2 px-4 border-b">{conductor.conductorId}</td>
                      <td className="py-2 px-4 border-b">{conductor.conductorFirstName} {conductor.conductorLastName}</td>
                      <td className="py-2 px-4 border-b">{conductor.conductorEmail}</td>
                      <td className="py-2 px-4 border-b">{conductor.conductorPhoneNumber}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-500 hover:text-blue-700 ml-2 icon"
                          onClick={() =>handleOpenModal(conductor.conductorId)}
                        >
                          <FaTrash color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No Conductor Found.
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
              <p className="text-2xl font-bold mb-5">Delete Conductor?</p>
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

export default Conductor;
