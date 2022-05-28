import React, { useContext } from 'react';
import { UserContext } from "../generic/UserContext";
import Icon from '../../assets/Icon';

function TextToSpeech() {
  const {textToSpeech } = useContext(UserContext);

  var text = ["",""];
  
  document.addEventListener('selectionchange', () => {
    text[0] = text[1];
    if (window.getSelection) {
        text[1] = window.getSelection().toString();
    } else if (window.selection && window.selection.type != "Control") {
        text[1] = window.selection.createRange().text;
    }
  });

  function readText() {
    const msg  = new SpeechSynthesisUtterance();
    msg.lang = 'it-IT';
    msg.text = text[0];
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speaking = false;
    } else {
      window.speechSynthesis.speak(msg);
    }
  }

  if(textToSpeech) {
    return (
      <>
        <button
          type="button"
          onClick={readText}
          className="ml-4 inline-flex rounded-md bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <Icon name="Megaphone" />
        </button>
      </>
    );
  }
};

export default TextToSpeech;