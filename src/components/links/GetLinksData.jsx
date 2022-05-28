import React, { useState, useContext, useEffect } from "react";
import { cookies, UserContext } from "../generic/UserContext"
import Icon from "../../assets/Icon";
import LinkTab from "./LinkTab";
import InfoModal from "../cloud/InfoModal";
import LinkModal from "./LinkModal";

function GetLinksData() {

  const [links, setLinks] = useState(null);
  const {setAlertType, setShowAlert} = useContext(UserContext);

  function Share(link_url) {
    navigator.clipboard.writeText("https://smartlink-site.it/_shared/"+link_url);
    setAlertType("copy");
    setShowAlert(true);
  }

  function getLinks() {
    const loginToken = cookies.get('loginToken');
    fetch('https://smartlink-site.it/_shared/getAll', {
      method: 'POST',
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      }
    })
    .then(response => response.json())
    .then(values => {
      setLinks(values.links)
    }); 
  }

  useEffect(() => {
    getLinks();
  }, []);

  const fileType = {
    file: "File",
    dir: "Folder",
  }

  if(links!=null) {
    return (
      <>
        {links.map(link => 
          <tr key={link.link_url} className="row hover:bg-blue-50 dark:hover:bg-zinc-800">
            <td className="px-4 py-3 md:w-auto text-gray-700 dark:text-gray-400">
              <div className="flex items-center text-sm">
                <div className="relative rounded-full w-8 h-8 mr-3">
                  <div className="absolute inset-0 rounded-full " aria-hidden="true">
                    <Icon name={fileType[link.file_type]} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{link.filename}</p>
                  <p className="hidden md:block text-xs text-gray-600 dark:text-gray-400">{link.file_type}</p>
                  <p className="visible md:hidden text-xs text-gray-600 dark:text-gray-400">{link.expiration_date}</p>
                </div>
              </div>  
            </td>
            <td className="w-32 py-3 mx-auto flex">
              <LinkTab link={link}/>
            </td>
            <td className="px-4 py-3 hidden md:table-cell text-center">
              <span className="text-sm">{link.expiration_date}</span>
            </td>
            <td className="w-20 px-4 py-3 hidden md:mx-auto md:flex">
              <div 
              className="hover:bg-blue-100 hover:dark:bg-zinc-700 hover:text-black dark:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"  
              onClick={() => {Share(link.link_url)}}>
                <Icon name="Share"/>
              </div>
              <div>
                <InfoModal noText={true} data={{filename: link.filename, path: link.file_location, type: fileType[link.file_type], size: link.file_size, upload_date: link.upload_date}} />
              </div>
            </td>
          </tr>
        )}
      </>
    )
  }
}

export default GetLinksData;