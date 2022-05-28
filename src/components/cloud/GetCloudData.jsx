import React, { useState, useEffect } from "react";
import Icon from "../../assets/Icon";
import ContextMenu from "./ContextMenu";
function GetCloudData(props) {

  const [update, setUpdate] = useState(false);

  function getDate(seconds) {
    var date = new Date(0)
    date.setUTCSeconds(seconds)
    return date.toDateString()
  }

  const fileType = {
    file: "File",
    dir: "Folder",
  }

  function changePath(item) {
    if(item.type=="dir") {
      if(props.currentPath=="/")
        props.setValue("/"+item.filename)
      else
        props.setValue(props.currentPath+"/"+item.filename)
    }
    return;
  }

  useEffect(() => {
    setUpdate(false);
  }, [update]);

  if(props.values!=null) {
    return (
      <>
        <ContextMenu refresh={setUpdate} setFileCopy={props.setFileCopy} fileCopy={props.fileCopy} currentPath={props.currentPath}/>
        {props.values.map(item => 
          <tr key={item.filename} className="row hover:bg-blue-50 dark:hover:bg-zinc-800">
            <td className="px-4 py-3 md:w-auto">
              <div className="flex items-center text-sm">
                <div className="relative rounded-full w-8 h-8 mr-3">
                  <div className="absolute inset-0 rounded-full" aria-hidden="true" onClick={() => changePath(item)} >
                    <Icon name={fileType[item.type]} />
                  </div>
                </div>
                <div>
                  <p filename={item.filename} path={props.currentPath} type={item.type} size={item.size} upload_date={getDate(item.lastModified)} className="filename font-semibold">{item.filename}</p>
                  <p className="hidden md:block text-xs text-gray-600 dark:text-gray-400">{item.type}</p>
                  <p className="visible md:hidden text-xs text-gray-600 dark:text-gray-400">{item.type}, {getDate(item.lastModified)}</p>

                </div>
              </div>  
            </td>
            <td className="px-4 py-3 hidden md:table-cell ">
              <span className="text-sm">{getDate(item.lastModified)}</span>
            </td>
            <td className="px-4 py-3 hidden md:table-cell ">
              <span className="text-sm">{fileType[item.type]}</span>
            </td>
            <td className="px-4 py-3 hidden md:table-cell ">
              <span className="text-sm">{item.type == "file" ? item.size + " bytes" : "/"} </span>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
              <span className="text-sm">{item.status}</span>
            </td>
          </tr>
        )}
      </>
    )
  }
}

export default GetCloudData;