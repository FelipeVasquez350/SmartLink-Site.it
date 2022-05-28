import React, { useContext } from "react";
import { UserContext } from "../components/generic/UserContext";
import Icon from "../assets/Icon";

function Header() {
  const { toggleSidebar } = useContext(UserContext);

  const titles = {
    "/cloud": "Cloud Storage", 
    "/links": "Links Overview",
    "/shared": "Files Shared with you", 
    "/settings": "Your Account Details"
  };
  
  return (
    <header className="inline-flex py-4 bg-white dark:bg-neutral-900 border-blue-400 dark:border-orange-400 border-b">
      <button
          className="ml-4 text-blue-500 dark:text-orange-400 lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <Icon name="Sidebar" />
      </button>
      <a className="ml-4 text-xl font-bold text-gray-800 dark:text-orange-400" style={{fontFamily: "Audiowide"}}>
        {titles[window.location.pathname]}
      </a>
    </header>
  );
}

export default Header;