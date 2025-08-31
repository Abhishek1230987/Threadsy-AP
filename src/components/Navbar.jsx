import React from "react";
import logo from "../assets/logo.jpg";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-[#1b1a1b]">
      <img className="w-[max(8%,80px)]" src={logo} alt="Logo" />
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
