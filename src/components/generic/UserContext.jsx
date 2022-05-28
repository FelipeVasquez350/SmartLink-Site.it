import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie';

export const UserContext = createContext();
export const cookies = new Cookies();

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && cookies) {
    const storedPrefs = cookies.get('pageTheme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }

  return 'light';
};

const getAccessibilitySettings = () => {
  if (typeof window !== 'undefined' && cookies) {
    const storedPrefs = cookies.get('accessibilitySettings');
    if (typeof storedPrefs === 'object') {
      return storedPrefs;
    }
  }

  return {
    textToSpeech: true,
    textSize: 1,
  };
};

function UserContextProvider ({children}) {
  const [User, setUser] = useState(cookies.get('loginToken'));
  const [theme, setTheme] = useState(getInitialTheme);
  const [textSize, setTextSize] = useState(getAccessibilitySettings()["textSize"]);
  const [textToSpeech, setTextToSpeech] = useState(getAccessibilitySettings()["textToSpeech"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('default');

  async function registerUser (fromData)  {
    try {
      const response = await fetch('https://smartlink-site.it/_register', {
        method: 'POST',
        body: fromData
      });
      const data = await response.json();
      console.log(data.success)
      if (data.success == true) 
        return true;
      else 
        return false;
    } 
    catch (error) {
      return {success:0, message:'Server Error!'};
    }
  }

  async function loginUser (formData) {
    try {
      const response = await fetch('https://smartlink-site.it/_logon', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if(data.success && data.token){
        cookies.set('loginToken', data.token);
        setTheme(data.pageTheme == "false" ? "light" : "dark");
        setTextSize(data.textSize == "false" ? 0 : 1);
        setTextToSpeech(data.textToSpeech == "false" ? false : true);
        setUser(data)
        return true;
      } 
      else
        return false;
    }
    catch (error) {
      return {success:0, message:'Server Error!'};
    }
  }

  async function loggedInCheck() {
    const loginToken = cookies.get('loginToken');
    if(loginToken){
      try {
        const response = await fetch('https://smartlink-site.it/_session', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginToken}`          
          }
        });
        const data = await response.json();
        if(data.success)
          return true;
        else
          return false;
      }
      catch (error) {
        return {success:0, message:'Server Error!'};
      }
    }
    return false;
  }

  function logout() {
    cookies.remove('loginToken');
    cookies.remove('pageTheme');
    cookies.remove('accessibilitySettings');
    setUser(null);
  }

  function updateSettings() {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);
    cookies.set('pageTheme', theme);
    cookies.set('accessibilitySettings', JSON.stringify({textToSpeech: textToSpeech, textSize: textSize}));
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }
  
  function closeSidebar() {
    setSidebarOpen(false)
  }

  function increaseTextSize() {
    setTextSize(textSize + 1);
  }

  function decreaseTextSize() {
    if(textSize - 1 > 0)
      setTextSize(textSize - 1);
  }

  function toggleTextSize() {
    setTextSize(textSize === 0 ? 1 : 0);
  }

  function toggleTextToSpeech() {
    setTextToSpeech(!textToSpeech);
  }

  useEffect(() => {
    updateSettings()
  },[theme, textSize, textToSpeech]);

  return (
    <UserContext.Provider value={{User, theme, sidebarOpen, showAlert, alertType, textSize, textToSpeech, registerUser, loginUser, loggedInCheck, logout, setTheme, toggleSidebar, closeSidebar, setShowAlert, setAlertType, toggleTextSize, toggleTextToSpeech, increaseTextSize, decreaseTextSize}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;