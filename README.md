# SmartLink-Site
  A web-app to store files on the cloud;
  > Currently running under https://smartlink-site.it until 27/12/2022 (domain expiration date)

  This project was made with the only purpouse of gettings the hands dirty into fullstack dev, it's not with an actual intent to provide a serious service whatsoever, also the only cookies required are for the login session, theme and accessibility settings.

  It was made using React.js v18, Tailwind and PHP + Composer with JWT 


  ## Project Structure
  ```
    ├─ SmartLink-Site (This repo)
    |   ├─ public
    |   |   ├─ .htaccess
    |   |   ├─ favicon.ico
    |   |   ├─ index.html
    |   |   ├─ logo192.png
    |   |   ├─ logo512.png
    |   |   ├─ manifest.json
    |   |   └─ robots.txt
    |   |
    |   ├─ src
    |   |   ├─ assets
    |   |   |   ├─ Icon.jsx
    |   |   |   ├─ Icons.svg
    |   |   |   └─ LoadingIcon.jsx
    |   |   |
    |   |   ├─ components
    |   |   |   ├─ accessibility
    |   |   |   |   ├─ index.jsx
    |   |   |   |   ├─ TextSize.jsx
    |   |   |   |   └─ TextToSpeech.jsx
    |   |   |   |
    |   |   |   ├─ cloud
    |   |   |   |   ├─ ContextMenu.jsx
    |   |   |   |   ├─ DragAndDrop.jsx
    |   |   |   |   ├─ FileModal.jsx
    |   |   |   |   ├─ FileTab.jsx
    |   |   |   |   ├─ GetCloudData.jsx
    |   |   |   |   ├─ index.jsx
    |   |   |   |   └─ InfoModal.jsx
    |   |   |   |
    |   |   |   ├─ generic
    |   |   |   |   ├─ Alert.jsx
    |   |   |   |   ├─ DesktopView.jsx
    |   |   |   |   ├─ index.js
    |   |   |   |   ├─ MobileView.jsx
    |   |   |   |   ├─ PrivateWrapper.jsx
    |   |   |   |   └─ UserContext.jsx
    |   |   |   |
    |   |   |   ├─ links
    |   |   |   |   ├─ GetLinksData.jsx
    |   |   |   |   ├─ index.js
    |   |   |   |   ├─ LinkModal.jsx
    |   |   |   |   ├─ LinkTab.jsx 
    |   |   |   |   └─ LinkUserList.jsx
    |   |   |   |
    |   |   |   └─ shared
    |   |   |       ├─ GetSharedData.jsx
    |   |   |       └─ index.js
    |   |   |
    |   |   ├─ pages
    |   |   |   ├─ Cloud.jsx
    |   |   |   ├─ Error404.jsx
    |   |   |   ├─ Header.jsx
    |   |   |   ├─ index.js
    |   |   |   ├─ Links.jsx
    |   |   |   ├─ Login.jsx
    |   |   |   ├─ Navigation.jsx
    |   |   |   ├─ Settings.jsx
    |   |   |   ├─ Shared.jsx
    |   |   |   └─ Signin.jsx
    |   |   |
    |   |   ├─ App.js
    |   |   ├─ index.css
    |   |   ├─ index.js
    |   |   ├─ service-worker.js
    |   |   └─ serviceWorker.js
    |   |  
    |   ├─ .gitattributes
    |   ├─ .gitignore
    |   ├─ LICENSE
    |   ├─ package.json
    |   ├─ README.md
    |   └─ tailwind.config.js
    |
    ├─ smartlink-site.it (Apache site folder)
    |   ├─ static
    |   ├─ vendor
    |   ├─ .htaccess
    |   ├─ assets-manifest.json
    |   ├─ composer.lock
    |   ├─ database.php
    |   ├─ favicon.ico
    |   ├─ fileManager.php
    |   ├─ index.html
    |   ├─ index.php
    |   ├─ logo192.png
    |   ├─ logo512.png
    |   ├─ manifest.json
    |   ├─ robots.txt
    |   ├─ service-worker.js
    |   └─ service-worker.js.map
    |
    └─ config.json (Configuration File)
  ```

  ## Pages

  This website currently holds $ pages, each one with the corresponding path in lowercase:

  ### Home 
   The presentation page, nothing more, nothing less (as of writing this it doesn't yet exists lmao)

  ### Cloud 
   Here you can browse through your files through a simple UI and use the context menu (Right Click when hovering on the file/folder) do things such as:
   * Rename: Once clicked the text will become editable, to confirm changes press Enter.
   * Copy: Copies the file, browse to the new location and then press Paste (as long as you don't refresh the page).
   * Cut: Same as copy but deletes the original file in it's previous location.
   * Paste: ``Do i really need to explain this?.``
   * Share: Opens a dialog where you can change the visibility setting: 
      * Public. 
      * Restriced: A text prompt will ask to insert a vaild user email to share to.
      * Private.
   * Download: Dowloads the file (zip if folder).
   * Info: Shows basic infos about the file/folder. 
   * Delete: Removes the file from your cloud.

  ### Links
   Here you can manage all your shared files/folders that aren't private.
  
  ### Shared
   Here you can visualize and download all the files/folders shared by other users to you.

  ### Settings
   Here you can view your user info, and enable 3 accessibility settings:
   * Dark Mode: ```Cuz Orange Looks Cool```
   * Text Size: adds two buttons at the bottom of the screen to resize the font to reasonable amounts.  
   * Text To speech: Once a piece of text its selected, you can press the Megaphone Button to make it read to you by your OS reader.

  ### Login
   Login page requiring your email and password

  ### Signin
   Sigin page to create your account, requiring a username, email and password (they don't need to be real, it will never send you an email)

  ## Backend
   The backend is fully made in PHP, using Json Web Tokens for authentication.
   Its divided into 3 files:
   * index.php: It redirects all the call for the backend routes ("https://smartlink-site.it/_routename").
   * database.php: The connection to the database (see config.json) and manages all the queries with prepared statements.
   * fileManager.php: Handles all the writing operations in the specified folder inside the constructor + the user email, edit the first part to your absolute path for the files location.

  ## Features
   * Progressive Web App (unusable offline but who cares)
   * Responsive Design (Mobile can swipe to call/hide the sidebar)

  ## Requirements and Installation   
  This project requires to have the following programs installed:
  
  * Node.js >= v16.x
  * PHP >= v7.4.3
  * Composer 2.3.5
  * Apache or equivalent

  To run on localhost it will require the build of the project alongside the php files to be inside your apache/nginx/xampp folder, in order to run php and use the .htaccess for routing, therefore run the following commands in the console, either:

  > NOTE: On xaamp it will print notices of pretty much everything it runs, so turn them off in the php.ini setting "display_errors=Off"

  ```
  yarn && yarn build
  ```

  or

  ```
  npm install && npm run build
  ```

  Then copy the build in your server folder.
  
  After that you will need to install composer from here https://getcomposer.org/download/
  
  Then inside the server folder create a file called composer.json, an empty json will do just fine ({"":""} for example), then run in the command line:

  ```
  composer install
  ```

  After that you will have to import the Json Web Token library, with:

  ```
  composer require firebase/php-jwt
  ```
  Also replace any call to "https://smartlink-site.it/" with "/", it will automatically redirect to localhost.

  And change the ftp directory path in database.php and fileManager.php.

  Then edit the config.json in order to link the database and a password for the Json Web Token. Put it in the same folder where your server folder would be located.

  ```
    config.json structure:

    {
      "host": "",
      "username": "",
      "password": "",
      "database": "",
      "jwt_secret": ""
    }
  ```
  > Also check your php.ini config file if the corresponding driver for your DBMS is enabled (the pdo one).

  And at last but check in your server configuration file if the rewrite module is enabled and the lines below correspond, otherwise the .htaccess won't work:
  
  ```
  <Directory ="/path/to/server">
    Options Indexes FollowSymLinks
    AllowOverride all
    Require all granted
  </Direcotry>
  ```

  ## Database Structure:
  ```
  CREATE TABLE `user` (
    `username` varchar(255) DEFAULT NULL,
    `email` varchar(255) PRIMARY KEY NOT NULL,
    `password` varchar(255) DEFAULT NULL,
    `user_creation_date` timestamp NULL DEFAULT NULL
  );

  CREATE TABLE `file` (
    `file_id` varchar(13) PRIMARY KEY NOT NULL,
    `file_size` int DEFAULT NULL,
    `file_location` varchar(255) DEFAULT NULL,
    `filename` varchar(255) DEFAULT NULL,
    `file_type` enum('block','char','dir','fifo','file','link','unknown') DEFAULT NULL, 
    `upload_date` timestamp NOT NULL
  );

  CREATE TABLE `link` (
    `link_url` varchar(13) PRIMARY KEY NOT NULL,
    `visibility` enum('Public','Restricted','Private','') NOT NULL DEFAULT 'Private',
    `expiration_date` timestamp NULL DEFAULT NULL
  );

  CREATE TABLE `settings` (
    `setting_id` varchar(255) PRIMARY KEY NOT NULL,
    `setting_description` varchar(255) NOT NULL
  );

  CREATE TABLE `storage` (
    `email` varchar(255) NOT NULL,
    `file_id` varchar(13) NOT NULL,
    `link_url` varchar(13) DEFAULT NULL,
    `owner` tinyint(1) DEFAULT NULL,
    PRIMARY KEY(email, file_id),
    FOREIGN KEY(email) REFERENCES user(email),
    FOREIGN KEY(file_id) REFERENCES file(file_id),
    FOREIGN KEY(link_url) REFERENCES link(link_url)

  );

  CREATE TABLE `user_settings` (
    `email` varchar(255) NOT NULL,
    `setting_id` varchar(255) NOT NULL,
    `value` tinyint(1) NOT NULL,
    PRIMARY KEY(email, setting_id),
    FOREIGN KEY(email) REFERENCES user(email),
    FOREIGN KEY(setting_id) REFERENCES settings(setting_id)
  );

  INSERT INTO `settings` (`setting_id`, `setting_description`) VALUES
  ('Dark Mode', 'Cambia il tema del sito da chiaro a scuro.'),
  ('Text Size', 'Cambia la grandezza del testo nel sito.'),
  ('Text To Speech', 'Permette di ascoltare il testo selezionato.');
  ```
  ![Database](/src/assets/database.png)