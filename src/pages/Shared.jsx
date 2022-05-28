import React, { useState, useEffect } from "react";
import { cookies } from "../components/generic/UserContext";
import GetSharedData from "../components/shared/GetSharedData";

function Shared() {

  const [users, setUsers] = useState(null)

  function getUsers() {
    const loginToken = cookies.get('loginToken');
    fetch('https://smartlink-site.it/_shared/getUsers', {        
      method: 'POST',
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      }
    })
    .then(response => response.json())
    .then(values => {
      setUsers(values.users)
    }); 
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mx-6 my-6">
        <p className="text-2xl">Here you can access file shared by other users to you</p>
        {users!=null ? (
          Object.entries(users).map(user =>  {return (          
            <GetSharedData user={user} />)}
          )) : (
            <>
            </>
          )
        }
      </div>
    </div>
  );
}

export default Shared;