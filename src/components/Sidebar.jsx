import { useState,  useEffect  } from "react";
import { FaChevronLeft, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ title, menus, indexcount }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const token = localStorage.getItem('Token');

    if (!token) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]); 

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } bg-primary-color h-screen p-5 pt-8 relative duration-300`}
    >
      {/* Sidebar toggle button */}
      <div
        className={`absolute cursor-pointer -right-5 top-9 w-10 h-10 border-primary-color
          border-2 rounded-full bg-white flex items-center justify-center ${
            !open && "rotate-180"
          }`}
        onClick={() => setOpen(!open)}
      >
        <FaChevronLeft className="text-primary-color" />
      </div>

      {/* Sidebar title */}
      <div className="flex gap-x-4 items-center">
        <h1
          className={`text-white font-sans origin-left font-medium text-xl duration-200 ${
            !open && "scale-0"
          }`}
        >
          {title}
        </h1>
      </div>

      {/* Sidebar menu list */}
      <ul className="pt-6 flex flex-col flex-grow">
        {menus.map((Menu, index) => (
          <li
            key={index}
            className={`flex rounded-md p-2 cursor-pointer hover:bg-white hover:text-black ${
              index !== indexcount ? "text-gray-300" : "text-black"
            } text-sm items-center gap-x-4 ${
              Menu.gap ? "mt-9" : "mt-2"
            } ${index === indexcount && "bg-white"}`}
            onClick={() => handleNavigation(Menu.path)} // Navigate on click
          >
            {Menu.icon}
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {Menu.title}
            </span>
          </li>
        ))}
        <li
          className="mt-auto flex rounded-md p-2 cursor-pointer hover:bg-white hover:text-black text-gray-300 
           text-sm items-center gap-x-4"
          onClick={logoutUser} // Optionally handle log out
        >
          <FaSignOutAlt />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Log out
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
