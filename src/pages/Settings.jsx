import React, { useState, useEffect, useContext } from "react";
import { UserContext, cookies } from '../components/generic/UserContext';
import { Switch } from '@headlessui/react'

function Settings() {
  const [userInfo, setUserInfo] = useState(null);
  const [settings, setSettings] = useState(null);
  const { setTheme, toggleTextSize, toggleTextToSpeech } = useContext(UserContext);

  async function getSettings() {
    const loginToken = cookies.get('loginToken');
    fetch('https://smartlink-site.it/_settings', {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      }
    }).then(response => response.json())
    .then(values => {
      setUserInfo(values)
      setSettings(values.settings)
    });
  }
  function updateSettings() {
    const loginToken = cookies.get('loginToken');
    const formData = new FormData();
    formData.append("settings", JSON.stringify(settings));
    fetch('https://smartlink-site.it/_settings', {
      method: 'POST',
      headers: {
        'Authorization':`Bearer ${loginToken}`,
      },
      body: formData,
    });
  }

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    updateSettings();
  }, [settings]);

  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mx-6 my-6">
        <div className="w-auto text-lg">
          <p className="text-xl font-semibold">Username: &#9; <a className="text-lg font-normal">{userInfo && userInfo.username}</a></p>
          <p className="text-xl font-semibold">Email: &#9; <a className="text-lg font-normal">{userInfo && userInfo.email}</a></p>
          <p className="text-xl font-semibold">Creation Date: &#9; <a className="text-lg font-normal">{userInfo && userInfo.user_creation_date}</a></p><br/>
          <h1 className="text-2xl my-3 font-bold ">Your Settings:</h1>
          <table>
            <tbody>
            {settings && settings.map((setting, index) => {
              return (
                <tr key={index} className="justify-center items-center">
                  <td className="py-2">
                    <a className="text-xl font-semibold mr-6">{setting.setting_id}</a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mr-6">{setting.setting_description}</p>
                  </td>
                  <td>
                    <Switch
                      checked={setting.value}
                      onChange={()=> {
                        let newSettings = [...settings];
                        newSettings[index].value = setting.value == "true" ? "false" : "true";
                        setSettings(newSettings);

                        if(setting.setting_id === 'Dark Mode')
                          setTheme(setting.value === 'true' ? 'dark' : 'light');
                        
                        else if(setting.setting_id === 'Text Size')
                          toggleTextSize();

                        else if(setting.setting_id === 'Text To Speech')
                          toggleTextToSpeech();
                      }}
                      className={`${
                        setting.value == "true" ? 'bg-blue-600 dark:bg-orange-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    > 
                      <span
                        className={`${
                          setting.value == "true" ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                      />
                    </Switch>
                  </td>
                </tr>
              ); 
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Settings;