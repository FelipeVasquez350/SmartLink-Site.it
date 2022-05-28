import React, { useContext, useEffect, useState, useCallback, Fragment } from 'react'
import { cookies, UserContext } from '../generic/UserContext';
import { Menu, Transition } from '@headlessui/react'
import LinkModal from '../links/LinkModal';
import InfoModal from './InfoModal';
import Icon from "../../assets/Icon";

const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);
  const [target, setTarget] = useState(null);

  const handleContextMenu = useCallback(
    (e) => {
      if(target != null) {
        target.classList.remove("bg-blue-50");
        target.classList.remove("dark:bg-zinc-800");
        target.removeAttribute("id");
      }
      var tar = e.target.closest(".row")
      if(tar) {
        e.preventDefault(); 
        tar.classList.add("bg-blue-50");
        tar.classList.add("dark:bg-zinc-800");
        tar.setAttribute("id", "selectedItem");
        setTarget(tar);
        setXPos(`${e.pageX+72}px`);
        setYPos(`${e.pageY}px`);
        setShowMenu(true);
      }
      else
        setShowMenu(false);
    },
    [setXPos, setYPos, setTarget, target]
  );

  const handleClick = useCallback((event) => {
    var ctx = document.getElementById("ContextMenu");
    var tab = document.getElementById("LinkTab");
   
    if(ctx && !ctx.contains(event.target) && !tab) {
      showMenu && setShowMenu(false);
      if(target != null) {
        target.classList.remove("bg-blue-50");
        target.classList.remove("dark:bg-zinc-800");        
        target.removeAttribute("id");
      }
    }
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu };
};

function ContextMenu(props) {
  const { xPos, yPos, showMenu } = useContextMenu();
  const { setShowAlert, setAlertType } = useContext(UserContext);

  function Rename() {
    let div = document.getElementById('selectedItem');
    let text = div.firstChild.firstChild.lastChild.firstChild;
    text.setAttribute("contentEditable","plaintext-only");

    document.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        text.setAttribute("contentEditable", false);

        var oldName = text.getAttribute("filename")
        var type = text.getAttribute("type")
        var path = text.getAttribute("path")
        var newName = text.innerHTML; 

        var formData = new FormData();
        formData.append("oldName", oldName);
        formData.append("newName", newName);
        formData.append("type", type);
        formData.append("path", path);
        formData.append("jwt", cookies.get("loginToken"));
        
        fetch("https://smartlink-site.it/_files/update",{
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          if(type="dir")
            setAlertType("renameFolder");
          else
            setAlertType("renameFile");
          setShowAlert(true);
        });
        return; 
      }
    })
  }
  
  function Copy() {
    let div = document.getElementById('selectedItem');
    let file = div.firstChild.firstChild.lastChild.firstChild;
    let copy = {filename: file.innerHTML, path: file.getAttribute("path"), type: file.getAttribute("type"), size: file.getAttribute("size"), cut: false};
    props.setFileCopy(copy);
    setAlertType("copy");
    setShowAlert(true);
  }

  function Cut() {
    let div = document.getElementById('selectedItem');
    let file = div.firstChild.firstChild.lastChild.firstChild;
    let cut = {filename: file.innerHTML, path: file.getAttribute("path"), type: file.getAttribute("type"), size: file.getAttribute("size"), cut: true};
    props.setFileCopy(cut);
    setAlertType("cut");
    setShowAlert(true);
  }

   function Paste() {
    var formData = new FormData();
    var copy = (props.fileCopy);

    var oldPath = copy.path + "/";
    oldPath =  oldPath.replace("//", "/");

    var newPath = props.currentPath + "/";
    newPath = newPath.replace("//", "/");

    formData.append("filename", copy.filename);
    formData.append("oldPath", oldPath);
    formData.append("newPath", newPath);
    formData.append("size", copy.size);
    formData.append("cut", copy.cut);
    formData.append("jwt", cookies.get("loginToken"));
   
    fetch("https://smartlink-site.it/_files/paste",{
      method: 'POST',
      body: formData,
    });

    setAlertType("paste");
    setShowAlert(true);
    return; 
  }
  
  function Delete() {
    let div = document.getElementById('selectedItem');
    let file = div.firstChild.firstChild.lastChild.firstChild;
    let filename = file.innerHTML;
    let path = file.getAttribute("path");
    let type = file.getAttribute("type");

    let formData = new FormData();
    formData.append("filename", filename);
    formData.append("path", path);
    formData.append("type", type);
    formData.append("jwt", cookies.get("loginToken"));

    fetch("https://smartlink-site.it/_files/delete",{
      method: 'POST',
      body: formData,
    });
    setAlertType("delete");
    setShowAlert(true);
    props.refresh(true);
    return; 
  }

  async function Download() {
    let div = document.getElementById('selectedItem');
    let text = div.firstChild.firstChild.lastChild.firstChild;

    const formData = new FormData();
    formData.append("filename", text.getAttribute("filename"));
    formData.append("file_location", text.getAttribute("path"));
    formData.append("jwt", cookies.get("loginToken"));

    const response = await fetch('https://smartlink-site.it/_shared/insert', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    window.location.replace(data.link.link_url);
    return; 
  }

  function Info() {
    let div = document.getElementById('selectedItem');
    let text = div.firstChild.firstChild.lastChild.firstChild;

    return {filename: text.getAttribute("filename"), path: text.getAttribute("path"), type: text.getAttribute("type"), size: text.getAttribute("size"), upload_date: text.getAttribute("upload_date")};
  }
  
  return (
    <>
      {showMenu ? (
        <Menu as="div" className="absolute z-10 inline-block text-left"  style={{
            top: yPos,
            left: xPos,
            }}>
          <Transition
            show={showMenu}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items  className="focus:outline-none absolute right-0 px-2 py-2 mt-2 w-36 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y dark:divide-gray-700 dark:bg-zinc-800 text-gray-700 dark:text-white dark:border-zinc-700  dark:border-2">
              <div id="ContextMenu">  
                <div className="px-1 py-1 ">
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                          active ? 'bg-blue-100 dark:bg-zinc-700 text-black dark:text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Rename}
                    >
                        <Icon name="Rename" />
                        <p className="ml-1">Rename</p>
                    </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                          active ? 'bg-blue-100 dark:bg-zinc-700 text-black dark:text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Copy}
                    >
                        <Icon name="Copy" />
                        <p className="ml-1">Copy</p>
                    </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                          active ? 'bg-blue-100 dark:bg-zinc-700 text-black dark:text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Cut}
                    >
                        <Icon name="Cut" />
                        Cut
                    </button>
                    )}
                </Menu.Item>             
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                          active ? 'bg-blue-100 dark:bg-zinc-700 text-black dark:text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Paste}
                    >
                        <Icon name="Paste" />
                        <p className="ml-1">Paste</p>
                    </button>
                    )}
                </Menu.Item>
                </div>
                <div className="px-1 py-1">
                <Menu.Item>
                    {({ active }) => (
                      <LinkModal />
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                          active ? 'bg-blue-100 dark:bg-zinc-700 text-black dark:text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Download}
                    >
                        <Icon name="Download" />
                        <p className="ml-1">Download</p>
                    </button>
                    )}
                </Menu.Item> 
                <Menu.Item>
                    {({ active }) => (
                      <InfoModal data={Info()} />
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-red-600 text-white' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={Delete}
                    >
                        <Icon name="Trashcan" />
                        <p className="ml-1">Delete</p>
                    </button>
                    )}
                </Menu.Item>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContextMenu;