import React from 'react'
import Navigation from '../../pages/Navigation'

function DesktopView() {
  return (
    <aside className="z-30 flex-shrink-0 hidden w-auto overflow-y-auto bg-white dark:bg-gray-800 lg:block">
      <Navigation />
    </aside>
  )
}

export default DesktopView;