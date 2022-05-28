import React from "react";
import GetLinksData from "../components/links/GetLinksData";

function Links() {
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mx-6 my-6">
        <p className="text-2xl">Here you can easily manage the links to your files that you've set for public or restricted use</p>
        <table className="w-full mt-10 whitespace-nowrap rounded-lg shadow-xs grid-flow-row-dense border-collapse">
          <thead className="text-xs font-semibold tracking-wide text-left text-white uppercase border-b dark:border-gray-700 bg-blue-500 dark:text-white dark:bg-orange-500 ">
            <tr>
              <th className="hidden md:table-cell px-4 py-3">
                <span>Filename</span>
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center">
                <span>Status</span>
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center">
                <span>Expiration Date</span>
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center">
                <span>Options</span>
              </th>
            </tr>    
          </thead>
          <tbody>
          <GetLinksData />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Links;