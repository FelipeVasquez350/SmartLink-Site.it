import React, { useState, useEffect, useContext } from 'react'
import { cookies, UserContext } from '../generic/UserContext';

function DragAndDrop(props) {

  const [files, setFiles] = useState(new FormData());
  const { setShowAlert, setAlertType } = useContext(UserContext);

  async function handleFileInput(event) {
    const inputs = event.target.files;
    var fromData = new FormData();
    var paths = "";
    var weight = 0;
    for (var i in inputs){
      paths += inputs[i].webkitRelativePath+"###";
      let size = parseInt(inputs[i].size);
      if(!isNaN(size))
        weight += size;
        fromData.append(i,inputs[i]);
    };
    fromData.append('paths', paths);
    fromData.append("jwt", cookies.get('loginToken'));

    if(weight < 10485760) {
      event.target.files = null;
      setFiles(fromData);
    }
    else {
      setAlertType('fileLimit')
      setShowAlert(true);
    }
  }

  async function postFiles() {
    const response = await fetch('https://smartlink-site.it/_files/uploadFiles', {
      method: 'POST',
      body: files
    });
    const output = await response.json();
    if(output.success) {
      setAlertType('uploadSuccess')
      setShowAlert(true);
    }
    else {
      setAlertType('uploadFail')
      setShowAlert(true);
    }
    document.getElementById('filesInput').value = "";
    props.setSendFiles(false)
  }

  async function postFolder() {
    const response = await fetch('https://smartlink-site.it/_files/uploadFolder', {
      method: 'POST',
      body: files
    });
    const output = await response.json();
    if(output.success) {
      setShowAlert(true);
      setAlertType('uploadSuccess')
    }
    else {
      setShowAlert(true);
      setAlertType('uploadFail')
    }
    document.getElementById('foldersInput').value = "";
    props.setSendFiles(false)
  }

  useEffect(()=> {
    if(props.sendFiles) {
      if(props.type === "Files")
        postFiles();
      else
        postFolder();
    }
  },[props.sendFiles])

  return (
    <div className="max-w-xl">
      <label
        className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-orange-400 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        >
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-center font-medium text-gray-600 dark:text-orange-400">Drop you {props.type === "Files" ? "files" : "folder"} here</p>   
        </div>
        {props.type === "Files" ? ( 
          <input id="filesInput" type="file" name="file" onChange={handleFileInput} multiple
            className="flex absolute justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none opacity-0" />
          ) : (
          <input  id="foldersInput" type="file" name="files[]" multiple="" webkitdirectory="" onChange={handleFileInput} 
            className="flex absolute justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none opacity-0" />
        )}
      </label>
    </div> 
  )
}

export default DragAndDrop;