import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Icon from '../../assets/Icon';

function InfoModal(props) {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  return (
    <>
      <div>
        <button
          className="hover:bg-blue-100 hover:dark:bg-zinc-700 hover:text-black dark:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"  
          onClick={openModal}
        >
          <Icon name="Info" />
          <p className="ml-1">{props.noText ? '' : 'Info'}</p>
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

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <div className="grid grid-cols-3 gap-x-2">
                    <Icon name="File" className="row-span-5 w-16 h-16" />
                    <p>Flename:</p><p>{props.data.filename}</p>
                    <p>Path:</p><p>{props.data.path}</p>
                    <p>Type:</p><p>{props.data.type}</p>
                    <p>Size:</p><p>{props.data.size} bytes</p>
                    <p>Upload Date:</p><p>{props.data.upload_date}</p>
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
export default InfoModal;