import React, { useState } from "react";
import { cookies } from "../generic/UserContext"
import Icon from "../../assets/Icon";
import InfoModal from "../cloud/InfoModal";

function GetSharedData(props) {

  const [shared, setShared] = useState(props.user ? props.user : null);

  async function Download(filename, file_location) {
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("file_location", file_location);
    formData.append("jwt", cookies.get("loginToken"));
    const response = await fetch('https://smartlink-site.it/_shared/insert', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    window.location.replace(data.link.link_url);
    return; 
  }

  const fileType = {
    file: "File",
    dir: "Folder",
  }
  
  if(shared!=null) {
    return (
      <>
        <table className="w-full mt-10 whitespace-nowrap rounded-lg shadow-xs grid-flow-row-dense">
          <thead className="text-xs font-semibold tracking-wide text-left text-white uppercase border-b dark:border-gray-700 bg-blue-500 dark:text-white dark:bg-orange-500 ">
            <tr>
              <th colSpan="4" className="px-4 pt-1 text-center">
                <span className="text-sm">{shared[0]}</span>
              </th>
            </tr>
            <tr>
              <th className="hidden md:table-cell px-4 pb-3">
                <span>Filename</span>
              </th>
              <th className="hidden md:table-cell px-4 pb-3 text-center">
                <span>Type</span>
              </th>
              <th className="hidden md:table-cell px-4 pb-3 text-center">
                <span>Size</span>
              </th>
              <th className="hidden md:table-cell px-4 pb-3  text-center">
                <span>Options</span>
              </th>
            </tr>      
          </thead>
          <tbody>
          {shared[1].map(shared =>
          <tr key={shared.filename} className="row hover:bg-blue-50 dark:hover:bg-zinc-800">
            <td className="px-4 py-3 md:w-auto text-gray-700 dark:text-gray-400">
              <div className="flex items-center text-sm">
                <div className="relative rounded-full w-8 h-8 mr-3">
                  <div className="absolute inset-0 rounded-full " aria-hidden="true">
                    <Icon name={fileType[shared.file_type]} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{shared.filename}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{shared.file_type}</p>
                </div>
              </div>  
            </td>
            <td className="hidden md:table-cell px-4 py-3 text-center">
              <span className="text-sm">{fileType[shared.file_type]}</span>
            </td> 
            <td className="hidden md:table-cell px-4 py-3 text-center">
              <span className="text-sm">{shared.file_size}</span>
            </td>
            <td className="w-20 md:mx-auto px-4 py-3 flex">
              <div 
              className="hover:bg-blue-100 hover:dark:bg-zinc-700 hover:text-black dark:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"  
              onClick={() => {Download(shared.filename, shared.file_location)}}>
                <Icon name="Download" />
              </div>
              <div>
                <InfoModal noText={true} data={{filename: shared.filename, path: shared.file_location, type: fileType[shared.file_type], size: shared.file_size, upload_date: shared.upload_date}} />
              </div>
            </td>
          </tr>
          )}
          </tbody>
        </table>
      </>
    )
  }
}

export default GetSharedData;