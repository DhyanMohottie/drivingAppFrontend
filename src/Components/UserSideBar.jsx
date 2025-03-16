import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MdOutlinePayment } from "react-icons/md";
import { PiNotePencilLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { MdOutlinePlayLesson } from "react-icons/md";


const UserSideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Navigate = useNavigate();

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  

  // Define the width for expanded and collapsed sidebar
  const expandedWidth = "w-15p";
  const collapsedWidth = "w-5p";


  const handleLogout = () => {
    // Clearing local storage
    localStorage.clear();
    // Reloading the page to reflect changes
    window.location.reload();
};
  return (
    <div
      className={`${
        isExpanded ? expandedWidth : collapsedWidth
      } bg-gray-200 h-screen p-5 transition-width duration-300`}
    >
      <div className="flex items-center space-x-4 p-2 mb-5">
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="text-xl rounded-full p-2 hover:bg-gray-300"
        >
          {isExpanded ? <FiX /> : <FiMenu />}
        </button>
        {/* Logo and title */}
        {isExpanded && (
          <div className="flex-grow">
            <span className="text-lg text-blue-800 font-semibold">
              Dashboard
            </span>
          </div>
        )}
      </div>

      <nav>
        <a
          // href=""
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3"
        >
          <AiOutlineUser  className="w-6 h-6 text-gray-500" />
          {!isExpanded ? null : (
            <span className="ml-3" onClick={() => Navigate("/user/edit")}>
              User Profile
            </span>
          )}
        </a>

        <a
          href="/selectQuizPackage"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3"
        >
          <PiNotePencilLight className="w-6 h-6 text-gray-500" />
          {!isExpanded ? null : <span className="ml-3">Attempt Quiz</span>}
        </a>

        <a
          href="/viewQuizMarks"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3"
        >
          <AiOutlineStock className="w-6 h-6 text-gray-500" />
          {!isExpanded ? null : <span className="ml-3">Quiz Progress</span>}
        </a>

        <a href="/ptsEnroll" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3">
          <IoCalendarOutline className="w-6 h-6 text-gray-500" />
          {!isExpanded ? null : (
            <>
              <span className="flex-1 ml-3 whitespace-nowrap">View Training Lesson</span>
            </>
          )}
        </a>

        <a href="#"className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3">
        <MdOutlinePlayLesson className="w-6 h-6 text-gray-500" />{!isExpanded ? null : <span className="ml-3">View Lessons</span>}</a>

        <a href="/user/payment"className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 mb-3">
        <CiCreditCard1  className="w-6 h-6 text-gray-500" />{!isExpanded ? null : <span className="ml-3">Payment</span>}</a>

        {/* <a
          href="#"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-300"
        >
          <AiOutlineStock className="w-6 h-6 text-gray-500" />
          {!isExpanded ? null : <span className="ml-3">Testing</span>}
        </a> */}
      </nav>

      <div className="mt-auto">
      <a href="#" onClick={handleLogout} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-red-200">
                <MdLogout className="w-6 h-6 text-red-500" />
                {isExpanded ? <span className="ml-3 text-red-500">Logout</span> : null}
            </a>
      </div>
    </div>
  );
};

export default UserSideBar;
