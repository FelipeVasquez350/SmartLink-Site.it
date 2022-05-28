import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import UserContextProvider from './components/generic/UserContext';

const root = createRoot(document.getElementById("root"));
root.render(
  <Router>    
    <UserContextProvider>
      <App/>
    </UserContextProvider>
  </Router>
);

serviceWorker.register();