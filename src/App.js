import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Cloud,
  Links,
  Shared,
  Settings,
  Login,
  Signin,
  Error404
} from "./pages";
import { UserContext } from "./components/generic/UserContext";
import { Alert, PrivateWrapper } from './components/generic';

function App() {
  const { User } = useContext(UserContext);
   
  return (
    <>
      <Alert />
      <Routes>
        <Route element={<PrivateWrapper auth={{ isAuthenticated: User }} />}>
          <Route path="/cloud" element={<Cloud />} />
          <Route path="/links" element={<Links />} />
          <Route path="/shared" element={<Shared />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Login />} />
        </Route>
        <Route index element={<Navigate replace to="/cloud" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
        <Route path="/404" element={<Error404 />} /> 
      </Routes>
    </>
  );
}
export default App;