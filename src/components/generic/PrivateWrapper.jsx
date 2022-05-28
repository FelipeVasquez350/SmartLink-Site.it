import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./UserContext";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import Header from "../../pages/Header";
import { TextSize, TextToSpeech } from "../accessibility";
function Layout() {
  
  const { toggleSidebar } = useContext(UserContext);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  
  function handleTouchStart(e) {
      setTouchStart(e.targetTouches[0].clientX);
  }
  
  function handleTouchMove(e) {
      setTouchEnd(e.targetTouches[0].clientX);
  }
  
  function handleTouchEnd() {
    if (touchStart - touchEnd < -150) {
      toggleSidebar()
    }
  }

  return (
    <>
      <DesktopView />
      <MobileView />
      <div className="flex flex-col w-full h-full" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <Header />
        <Outlet />
      </div>
      <span className="absolute bottom-5 w-full flex justify-center items-center">
        <TextSize />
        <TextToSpeech />
      </span>
    </>
  );
};

const PrivateWrapper = ({ auth: { isAuthenticated } }) => {
  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
};

export default PrivateWrapper;