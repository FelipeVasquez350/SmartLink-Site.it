import React, { Fragment, useState, useEffect } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Listbox, Transition } from '@headlessui/react'
import { cookies } from '../generic/UserContext'

const linkSettings = [
  { type: 'Private' },
  { type: 'Restricted' },
  { type: 'Public' },
]

function LinkTab(props) {
  const [selected, setSelected] = useState(props.link ? {type: props.link["visibility"]} : null);
  
  async function updateLink() {
    const loginToken = cookies.get('loginToken');
    const formData = new FormData();
    formData.append('link_url', props.link["link_url"]);
    formData.append('visibility', selected.type);
    fetch('https://smartlink-site.it/_shared/update', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      }
    })
    if(props)
      props.update(selected.type);
  }

  useEffect(() => {
    updateLink();
  }, [selected])

  if(selected) {
    return (
      <>
      <div className="h-8">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button id="visibilityButton" className="relative w-32 align-middle cursor-default rounded-lg bg-white dark:bg-neutral-900 py-2 pl-3 pr-10 shadow-md  dark:ring-zinc-700 ring-offset-2 ring-offset-blue-400 dark:ring-offset-orange-400 ring-1 sm:text-sm text-center">
              <span id="visibilityType" className="block truncate text-black dark:text-orange-400">{selected.type}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400 dark:text-orange-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="relative z-10 mt-2 w-32 overflow-auto rounded-md bg-white text-base dark:bg-neutral-900 py-2 shadow-md dark:ring-zinc-700 ring-offset-2 ring-offset-blue-400 dark:ring-offset-orange-400 ring-1 sm:text-sm">
                {linkSettings.map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 text-center ${
                        active ? 'text-blue-500  dark:text-orange-400' : 'text-gray-900 dark:text-white'
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.type}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500 dark:text-orange-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      </>
    )
  }
}
export default LinkTab;