import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import DragAndDrop from './DragAndDrop'
import LoadingIcon from '../../assets/LoadingIcon'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FileTab() {
  const [type] = useState(["Files", "Folders"])
  const [send, setSend] = useState(false);
  
  return (
    <div className="w-full max-w-md sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 dark:bg-zinc-800 p-1">
          {type.map((item) => (
            <Tab
              key={item}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 dark:text-orange-400',
                  'ring-white dark:ring-zinc-700 ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-orange-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-zinc-900 shadow'
                    : 'text-zinc-500 dark:text-zinc-500 hover:bg-white/[0.6] dark:hover:bg-white/[0.12] '
                )
              }
            >
              {item}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 bg-white dark:bg-zinc-900">
          {type.map((item, idx) => (
            <Tab.Panel key={idx} >
              <div className="px-4 py-6 sm:px-0">
                <DragAndDrop sendFiles={send} setSendFiles={setSend} type={item}/>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 dark:bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={() => setSend(true)}
                  disabled={send}
                >
                  {send ? <LoadingIcon /> : "Upload"}
                </button> 
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
export default FileTab;