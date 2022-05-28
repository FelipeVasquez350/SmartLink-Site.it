import React from "react";
import { Link } from "react-router-dom";

function Error404 () {
  return (
    <div className="w-full h-full overflow-y-auto flex bg-white dark:bg-zinc-900 text-6xl text-center text-blue-500 dark:text-orange-500 ">
      <div className="my-auto w-full">
        <p>ERROR 404</p>
        <p>Page not found</p>
        <br/>
        <Link to="/cloud">
          <p>Go back to the homepage</p>
        </Link>
      </div>      
    </div>
  );
}

export default Error404;