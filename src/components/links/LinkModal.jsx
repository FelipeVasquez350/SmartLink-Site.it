import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Icon from '../../assets/Icon';
import LinkTab  from './LinkTab';
import { cookies } from '../generic/UserContext';
import LinkUserList from './LinkUserList';

function LinkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState(null);
  const [update, setUpdate] = useState(null);

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  async function getLink() {
    let div = document.getElementById('selectedItem');
    let text = div.firstChild.firstChild.lastChild.firstChild;
    
    const loginToken = cookies.get('loginToken');
    const formData = new FormData();
    formData.append("filename", text.getAttribute("filename"));
    formData.append("file_location", text.getAttribute("path"));
    const response = await fetch('https://smartlink-site.it/_shared/insert', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      }
    });
    const data = await response.json();
    setLink(data.link)
    return; 
  }

  function CopyLink() {
    var linkText = document.getElementById("link_input").value;
    navigator.clipboard.writeText(linkText);
  }

  useEffect(() => {
    if(link==null)
      getLink();
    if(document.getElementById("link_input"))
      document.getElementById("link_input").value = link["link_url"];
  }, [link, update]);  

  return (
    <>    
      <div>
        <button
          className="hover:bg-blue-100 hover:dark:bg-zinc-700 hover:text-black dark:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"  
          onClick={() => {openModal(); getLink()}}        
        >       
          <Icon name="Share" />
          <p className="ml-1">Share</p>
        </button>
      </div>
        
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div  className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                  <div id="LinkTab">
                    <div className="inline-flex text-blue-500 dark:text-orange-400">
                      <Icon name="Share"/>
                      <p className="ml-3 text-lg">Share</p>
                    </div>
                    <div className="w-full mx-auto text-black dark:text-white">
                      <td><p className="h-full mt-2 mr-2 text-base">Impostazioni di visibilità del link:</p></td>
                      <td className="px-4 py-3"><LinkTab link={link} update={setUpdate}/></td>
                    </div>
                    <div>
                      <LinkUserList visibility={update} link={link}/>
                    </div>
                    <div className="w-full inline-flex mt-6 mb-6">
                      <input type="text" id="link_input" className="w-full rounded-md text-center bg-blue-200 dark:bg-orange-300" readOnly />
                      <button type="button" className="inline-flex rounded-md bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 ml-2 px-3 py-2 text-sm font-medium text-white" onClick={CopyLink}>Copy</button>
                    </div>
                    <div>
                      <button type="button" className="rounded-md bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white" onClick={closeModal}>Close</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
export default LinkModal;