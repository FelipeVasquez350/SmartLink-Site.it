import React, { useContext } from 'react';
import { UserContext } from "../generic/UserContext";
import Icon from '../../assets/Icon';

function TextSize() {
  const { textSize } = useContext(UserContext)

  function Zoom() {
    ["p", "h1", "h2", "a", "span"].forEach(tag => {
      document.querySelectorAll(tag).forEach(t => {
        let style = window.getComputedStyle(t, null).getPropertyValue('font-size');
        let currentSize = parseFloat(style);
        if(currentSize < 20) 
          t.style.fontSize = (currentSize + 1) + 'px';
      });
    });
  }
  function UnZoom() {
    ["p", "h1", "h2", "a", "span"].forEach(tag => {
      document.querySelectorAll(tag).forEach(t => {
        let style = window.getComputedStyle(t, null).getPropertyValue('font-size');
        let currentSize = parseFloat(style);
        if(currentSize > 14) 
          t.style.fontSize = (currentSize - 1) + 'px';
      });
    });
  }

  if(textSize != 0) {
    return (
      <>
        <button
          type="button"
          onClick={Zoom}
          className="mr-2 inline-flex rounded-md bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <Icon name="ZoomIn" />
        </button>
        <button
          type="button"
          onClick={UnZoom}
          className="ml-2 inline-flex rounded-md bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <Icon name="ZoomOut" />
        </button>
      </>
    );
  }
};

export default TextSize;