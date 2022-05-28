import React, { useState, useEffect} from 'react';
import { cookies } from '../generic/UserContext';
import Icon from '../../assets/Icon';

function LinkUserList(props) {
  const [userList, setUserList] = useState(null);

  function getLinks() {
    const loginToken = cookies.get('loginToken');
    const formData = new FormData();
    formData.append('link_url', props.link["link_url"]);
    fetch('https://smartlink-site.it/_shared/getSharedUsers', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      }
    })
    .then(response => response.json())
    .then(values => {
      setUserList(values.users)
    }); 
  }

  function removeUser(email) {
    const loginToken = cookies.get('loginToken');
    const formData = new FormData();
    formData.append('link_url', props.link["link_url"]);
    formData.append('email', email);
    fetch('https://smartlink-site.it/_shared/removeUser', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      }
    })
    getLinks();
  }
  

  function enterKeyHandler(event) {
    if (event.key === 'Enter') {
      const userMail = document.getElementById("userListInput").value;
      const linkText = document.getElementById("link_input").value;
      const formData = new FormData();
      const loginToken = cookies.get('loginToken');
      formData.append("email", userMail);
      formData.append("link_url", linkText);
      fetch('https://smartlink-site.it/_shared/addUser', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization':`Bearer ${loginToken}`,
        }
      });
      document.getElementById("userListInput").value = "";
      getLinks();
    }
  }

  useEffect(() => {
    if(!userList)
        getLinks();
  }, [userList, props.visibility]);


  if(props.visibility == "Restricted") {
    return (
      <>
        <div className="flex justify-center mr-10 my-3">
          <input type="text" placeholder="user@mail.com" id="userListInput" className="w-full rounded-md bg-white dark:bg-neutral-900 pl-3 pr-10 shadow-md  dark:ring-zinc-700 ring-offset-2 ring-offset-blue-400 dark:ring-offset-orange-400 ring-1 ml-3 px-4 py-2 text-sm font-medium text-black dark:text-white" onKeyDown={enterKeyHandler}/>
        </div>        
        <div className="flex justify-center text-center w-80 ml-6 h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer border-blue-400 dark:border-orange-400 dark:text-white bg-white dark:bg-neutral-900 py-2 pl-3 pr-10 shadow-md">
          <ul>
          {userList!= null ? (userList.map(user =>  {
            return (          
              <div className='inline-flex'>{user.email} <a onClick={() => removeUser(user.email)}><Icon name="Trashcan" /></a></div>)}
            )) : null
          }
          </ul>
        </div>
      </>
    );
  }
}
export default LinkUserList;
