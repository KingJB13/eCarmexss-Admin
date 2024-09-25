import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaChartBar, FaPlus, FaCalendarAlt, FaSearch, FaClock } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const Shift = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formData, setFormData] = useState({
    conductorFirstName: "",
    conductorLastName: "",
  });
  const [shiftData, setShiftData] = useState([]); // State to hold shift data
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Fetch shift data from the API on component mount
  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const response = await axios.get("https://api.example.com/shifts"); // Replace with your API endpoint
        setShiftData(response.data); // Assuming the response contains an array of shift data
      } catch (error) {
        console.error("Error fetching shift data:", error);
      }
    };

    fetchShiftData();
  }, []); // Empty dependency array means this effect runs only once

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmationClose = () => setShowConfirmationModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredShiftData = shiftData.filter((shift) =>
    shift.busNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menus = [
    { title: "Dashboard", icon: <FaChartBar />, path: "/home" },
    { title: "Register", icon: <FaPlus />, path: "/register" },
    { title: "Manage Shifts", icon: <FaCalendarAlt />, path: "/shift" },
  ];

  return (
    <div className="flex">
      <Sidebar title="ECARMEXSS" menus={menus} indexcount={2} />
      <div className="flex flex-col w-full justify-start items-start p-4 bg-gray-200 mt-2 font-sans">
        <p className="p-5 text-xl font-bold">Shift</p>
        <div className="w-full max-w-full border border-gray-300 rounded-2xl p-6 sm:p-8 bg-white shadow-lg">
          <div className="p-4">
            <div id="search-container" className="mb-4 text-right">
              <input
                id="search"
                type="text"
                className="border rounded p-2"
                placeholder="Search Bus No."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-secondary-color border-b">
                <tr>
                  <th className="py-2 px-4 border-b">Bus No.</th>
                  <th className="py-2 px-4 border-b">Driver Name</th>
                  <th className="py-2 px-4 border-b">Plate No.</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShiftData.length > 0 ? (
                  filteredShiftData.map((shift) => (
                    <tr key={shift.shiftId} className="odd:bg-gray-200">
                      <td className="py-2 px-4 border-b">{shift.jeepneyNumber}</td>
                      <td className="py-2 px-4 border-b">`${shift.User.firstName} ${shift.User.lastName}`</td>
                      <td className="py-2 px-4 border-b">{shift.plateNumber}</td>
                      <td className="py-2 px-4 border-b">shift.isActive ? Active  : Inactive </td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-500 hover:text-blue-700 icon">
                          <FaSearch />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 ml-2 icon"
                          onClick={handleOpenModal}
                        >
                          <FaClock />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No shifts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Conductor Details */}
        {showModal && (
          <div className="modal flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70">
            <div className="modal-content bg-white p-6 rounded-lg max-w-sm w-full relative">
              <span
                className="close absolute top-3 right-3 text-2xl cursor-pointer"
                onClick={handleCloseModal}
              >
                &times;
              </span>
              <h3 className="text-xl font-semibold mb-4">Conductor Details</h3>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label htmlFor="firstName" className="block font-semibold mb-1">
                    Conductor First Name:
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="conductorFirstName"
                    value={formData.conductorFirstName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="lastName" className="block font-semibold mb-1">
                    Conductor Last Name:
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="conductorLastName"
                    value={formData.conductorLastName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border"
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="confirmation-modal flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70">
            <div className="confirmation-content bg-gray-800 p-6 rounded-lg max-w-sm w-full text-white text-center">
              <p>Are you sure?</p>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-2"
                onClick={() => window.location.href = '#'}
              >
                Cancel
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mx-2"
                onClick={handleConfirmationClose}
              >
                Clock out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shift;
