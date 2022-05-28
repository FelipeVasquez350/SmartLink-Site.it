import React, { Fragment, useContext } from 'react';
import Navigation from '../../pages/Navigation';
import { Transition } from '@headlessui/react'
import { UserContext } from './UserContext'

function MobileView() {
  const { sidebarOpen, closeSidebar } = useContext(UserContext)

  return (
    <Transition show={sidebarOpen}>
      <>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={closeSidebar} onTouchStart={closeSidebar}/>
        </Transition.Child>

        <Transition.Child
        as={Fragment}
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0 transform -translate-x-20"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform -translate-x-20"
        >
          <aside className="fixed inset-y-0 z-50 flex-shrink-0 w-auto overflow-y-auto bg-white dark:bg-gray-800 lg:hidden">
            <Navigation />
          </aside>
        </Transition.Child>
      </>
    </Transition>
  );
}

export default MobileView;
