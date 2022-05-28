import React, { Fragment, useContext } from 'react';
import { Transition } from '@headlessui/react'
import { UserContext } from "./UserContext";

function Alert() {
  const { showAlert, alertType, setShowAlert } = useContext(UserContext);

  const modes = {
    login: {
      title: 'Login Failed',
      message: 'Please recheck the email and password and try again.',
      status: false
    },
    signin: {
      title: 'Signin Failed',
      message: 'These credentials are already being used.',
      status: false
    },
    uploadSuccess: {
      title: 'Upload Successful',
      message: 'The files were stored in the cloud.',
      status: true
    },
    uploadFail: {
      title: 'Upload Failed',
      message: 'The files couldn\'t be stored in the cloud.',
      status: false
    },
    fileLimit: {
      title: 'File Limit Reached',
      message: 'You have reached the file limit of 10mb.',
      status: false
    },
    copy: {
      title: 'Copy Successful',
      message: 'The file was copied.',
      status: true
    },
    cut: {
      title: 'Cut Successful',
      message: 'The file was cut.',
      status: true
    },
    paste: {
      title: 'Paste Successful',
      message: 'The file was pasted.',
      status: true
    },
    delete: {
      title: 'Delete Successful',
      message: 'The file was deleted.',
      status: true
    },
    renameFile: {
      title: 'Rename Successful',
      message: 'The file was renamed.',
      status: true
    },
    renameFolder: {
      title: 'Rename Successful',
      message: 'The folder was renamed.',
      status: true
    },
    default: {
      title: 'Default Title',
      message: 'If you see this i messed up.',
      status: false
    }
  }
  return (
    <Transition show={showAlert}>
      <>
        <Transition.Child
        as={Fragment}
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0 transform -translate-y-20"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform -translate-y-20"
        >
        <div className={`
          ${modes[alertType].status ? 'text-blue-500 bg-blue-200 border-blue-100 dark:text-black dark:bg-orange-400 dark:border-black' : 'text-red-500 bg-red-100 border-red-100'} border 
          ${modes[alertType].status ? ' ' : ''} px-4 py-3 rounded absolute top-10 right-10`} role="alert">
          <strong className="font-bold">{modes[alertType].title}</strong>
          <span className="block sm:inline ml-1 mr-8">{modes[alertType].message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className={`fill-current h-6 w-6 text-${modes[alertType].color}`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => setShowAlert(false)}><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
        </Transition.Child>
      </>
    </Transition>
  );
};

export default Alert;