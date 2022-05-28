import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../components/generic/UserContext";
import Icon from "../assets/Icon";

const navigation = [
  { name: 'Cloud', path: '/cloud', },
  { name: 'Links', path: '/links' },
  { name: 'Shared', path: '/shared' },
  { name: 'Settings', path: '/settings' },
]

function Navigation() {
  const [active, setActive] = useState(0);
  const { logout, closeSidebar } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const curPath = window.location.pathname;
    const activeItem = navigation.findIndex(item => item.path === curPath);
    setActive(curPath.length === 0 ? 0 : activeItem);
  }, [location]);
  
  return (
    <div className="h-full py-4 bg-white dark:bg-neutral-900 border-blue-400 dark:border-orange-400 border-r">
      <a className="ml-4 text-xl font-bold text-gray-800 dark:text-orange-400" style={{fontFamily: "Audiowide"}}>
        Smartlink
      </a>
      <ul className="mt-6">
        {navigation.map((route, index) =>
          <li className={`border-blue-400 ${active === index ? 'text-blue-500 dark:text-orange-400' : 'dark:text-gray-400'} relative px-6 py-3`} key={route.name}>
            <Link 
                to={route.path} 
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-blue-600 dark:hover:text-orange-300"
                activeclassname="text-gray-800 dark:text-gray-100"
                onClick={closeSidebar}
              >
              <Icon name={route.name} />
              <span className="ml-4">{route.name}</span>
            </Link>       
          </li>
          )
        }
        <li className="border-gray-200 dark:text-gray-400 relative px-6 py-3" key="Logout">
          <button 
            className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-blue-600 dark:hover:text-orange-300"
            activeclassname="text-gray-800 dark:text-gray-100"
            onClick={logout}
          >
            <Icon name="Logout" />
            <span className="ml-4">LogOut</span>
          </button>       
        </li>
      </ul>
    </div>
  );
}

export default Navigation;