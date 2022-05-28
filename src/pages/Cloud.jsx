import React, { useState, useEffect } from "react";
import Icon from "../assets/Icon";
import { cookies } from "../components/generic/UserContext";
import { GetCloudData, FileModal } from "../components/cloud";

function Cloud() {
  const [data, setData] = useState(null);
  const [path, setPath] = useState("/");
  const [sort, setSort] = useState("type");
  const [inverse, setInverse] = useState(false);
  const [navbarPath, setNavbarPath] = useState(["/"]);
  const [fileCopy, setFileCopy] = useState({});

  function sortData(data, sorting) {
    var sortedData = data.sort(function(a, b) {
      if(isNaN(a[sorting]))
        return a[sorting].localeCompare(b[sorting])
      else
        return a[sorting] - b[sorting]
    });
    if(inverse)
      sortedData.reverse()
    return sortedData;
  }

  function getIcon(type) {
    if(type==sort){
      if(inverse) 
        return "SortAscending"
      else
        return "SortDescending"
    }
    else
      return "Sort";
  }

  useEffect(() => {
    var formData = new FormData();
    formData.append("path", path);
    formData.append("jwt", cookies.get("loginToken"));
    fetch("https://smartlink-site.it/_files/get",{
      method: 'POST',
      body: formData,
    }) 
    .then(response => response.json())
    .then(values => {
      setData(sortData(values, sort));
    })
    .catch(console.error)
  }, [path, sort, inverse]);

  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-900">
      <div className="mx-6 my-6">
        <div className="w-full gap-4 mb-3 inline-flex">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <div className="flex items-center" onClick={() => setPath("/")}>
                  <a className="text-gray-400 hover:text-gray-900 text-xl font-medium">/</a>
                  <a className="text-gray-400 hover:text-gray-900 ml-3 text-sm font-medium">Root</a>
                  <a className="text-gray-400 hover:text-gray-900 ml-3 text-sm font-medium">/</a>
                </div>
              </li>
              {path.split("/").slice(1)[0] != "" && (
                path.split("/").slice(1).map((item, index) => {
                  index == 0 ? (navbarPath[index+1]=navbarPath[index]+item) : (navbarPath[index+1] = navbarPath[index]+"/"+item);
                  return (
                  <li>
                    <div className="flex items-center">
                      <a className="text-gray-400 hover:text-gray-900 text-sm font-medium" onClick={() => setPath(navbarPath[index+1])}>{item}</a>
                      <a className="text-gray-400 hover:text-gray-900 ml-3 text-sm font-medium">/</a>
                    </div>
                  </li>
                  )})
                )}
            </ol>
          </nav>
          <FileModal/>
        </div>
        <table className="w-full whitespace-nowrap rounded-lg shadow-xs grid-flow-row-dense border-collapse">
          <thead className="text-xs font-semibold tracking-wide text-left text-white uppercase border-b dark:border-gray-700 bg-blue-500 dark:text-white dark:bg-orange-500 ">
            <tr>
              <th className="hidden md:table-cell px-4 py-3">
                <div className="inline-flex space-x-2" onClick={() => {setSort("filename"); setInverse(!inverse);}}>
                  <a>Filename</a>
                  <Icon name={getIcon("filename")}/>
                </div>
              </th>
              <th className="hidden md:table-cell px-4 py-3">
                <div className="inline-flex space-x-2" onClick={() => {setSort("lastModified"); setInverse(!inverse);}}>
                  <a>Date</a>
                  <Icon name={getIcon("lastModified")}/>
                </div>
              </th>
              <th className="hidden md:table-cell px-4 py-3">
                <div className="inline-flex space-x-2" onClick={() => {setSort("type"); setInverse(!inverse);}}>
                  <a>Type</a>
                  <Icon name={getIcon("type")}/>
                </div>
              </th>
              <th className="hidden md:table-cell px-4 py-3">
                <div className="inline-flex space-x-2" onClick={() => {setSort("size"); setInverse(!inverse);}}>
                  <a>Size</a>
                  <Icon name={getIcon("size")}/>
                </div>
              </th>
              <th className="hidden md:table-cell px-4 py-3">
                <div className="inline-flex space-x-2">
                  <a>Stato</a>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 ">
            <GetCloudData values={data} setValue={setPath} fileCopy={fileCopy} setFileCopy={setFileCopy} currentPath={path}/>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cloud;