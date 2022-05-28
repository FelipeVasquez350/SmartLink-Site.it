<?php
session_start();
include("database.php");
include("fileManager.php");
require './vendor/autoload.php';
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, PATCH, OPTIONS');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$path = array();
preg_match_all('/\/_*([a-z]|[0-9]|[A-Z])+/', $_SERVER["REQUEST_URI"], $path);

if (!sizeof($path)) {
  $err = array(
    "error" => array(
      "status" => "404",
      "message" => "Bad URL"
    )
  );
  echo json_encode($err);
  exit();
}
$db = new Database();
$uri = $path[0];
$res = $uri[0];
$subres = str_replace('/', '', $uri[1]);

if($res == "/_logon") {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $db->loginUser($_POST);
    if($user != null) {
      $userSettings = $db->getUserSettings($_POST["email"]);
      echo json_encode(array("success" => true, "token" => $user['jwt'], "pageTheme" => $userSettings[0]["value"], "textSize" => $userSettings[1]["value"], "textToSpeech" => $userSettings[2]["value"]));
    }
    else {
      $err = array(
        "error" => array(
          "status" => "404",
          "message" => "User not found"
        )
      );
      echo json_encode($err);
    }
    exit();
  }
  else if($_SERVER["REQUEST_METHOD"] == "GET") {
    echo "GET method requests are not accepted for this resource";
    exit();
  }
}

else if($res == "/_register") {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $db->registerUser($_POST);
    if($user != null) {
      echo json_encode(array("success" => true));
    }
    else {
      echo json_encode(array("success" => false));
    }
    exit();
  }
  else if($_SERVER["REQUEST_METHOD"] == "GET") {
    echo "GET method requests are not accepted for this resource";
    exit();
  }
}

else if($res == "/_settings") {
 if($_SERVER["REQUEST_METHOD"] == "POST") {
  $user = $db->verifyToken();
  if($user["success"]) {
    $settings = $db->updateUserSettings($user);
    if($settings != null) {
      echo json_encode(array("success" => true));
      exit();
    }
    else {
      $err = array(
        "error" => array(
          "status" => "404",
          "message" => "Couldn't update settings"
        )
      );
      echo json_encode($err);
      exit();
    }
  }
  else {
    echo json_encode("User Not Verified");
    exit();
  }
  }
  else if($_SERVER["REQUEST_METHOD"] == "GET") {
    $user = $db->verifyToken();
    if($user["success"]) {
      $settings = $db->getUserSettings($user["email"]);
      if($settings != null) {
        echo json_encode(array("success" => true, "username" => $user["username"], "email" => $user["email"], "user_creation_date" => $user["user_creation_date"],"settings" => $settings));
        exit();
      }
      else {
        $err = array(
          "error" => array(
            "status" => "404",
            "message" => "Settings not found"
          )
        );
        echo json_encode($err);
        exit();
      }
    }
    else {
      echo json_encode("User Not Verifiedn");
      exit();
    }
  }
}

else if($res == "/_files") {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $db->verifyToken();
    if($user["success"]) {

      $storage = new FileManager($user["email"]);

      if($subres == "uploadFiles") {
        $storage->uploadFile($_FILES);
        echo json_encode(array("success" => true));
      }
      if($subres == "uploadFolder") {
        $storage->uploadFolder($_FILES);
        echo json_encode(array("success" => true));
      }
      if($subres == "get") {
        $storage->showFolder($_POST["path"]);
      }
      else if($subres == "update") {
        $storage->update($_POST["oldName"], $_POST["newName"], $_POST["path"], $_POST["type"]);
      }
      else if($subres == "paste") {
        if($_POST["cut"] == true) 
          $storage->cutAndPaste($_POST["filename"], $_POST["oldPath"], $_POST["newPath"]);
        else
          $storage->copyAndPaste($_POST["filename"], $_POST["oldPath"], $_POST["newPath"], $_POST["size"]);
      }
      else if($subres == "delete") {
        $storage->delete($_POST["filename"], $_POST["path"], $_POST["type"]);
      }
    }
    else 
      echo json_encode("User Not Verified");
      exit();
  }
  exit();
}

else if($res == "/_shared") {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $db->verifyToken();
    if($user["success"]) {
      if($subres == "insert") { 
        $link_url = $db->checkLink($_POST["filename"], $_POST["file_location"]);
        if($link_url) {
          echo json_encode(array("success" => true, "link" => $link_url));
        }
        else {
          $link = $db->createLink($user["email"], $_POST["filename"], $_POST["file_location"]);
          echo json_encode(array("success" => true, "link" => $link));
        }
      }
      else if($subres == "update") {
        if($db->updateLink($_POST["link_url"], $_POST["visibility"]))
          echo json_encode(array("success" => true));
        else
          echo json_encode(array("success" => false));
      }
      else if($subres == "addUser") {
        if($db->allowUser($_POST["email"], $_POST["link_url"]))
          echo json_encode(array("success" => true));
        else
          echo json_encode(array("success" => false));
      }
      else if($subres == "getUsers") {
        $users = $db->getUsers($user);
        echo json_encode(array("success" => true, "users" => $users));
      }
      elseif($subres == "getSharedUsers") {
        $users = $db->getSharedUsers($_POST["link_url"]);
        echo json_encode(array("success" => true, "users" => $users));
      }
      else if($subres == "removeUser") {
        if($db->unallowUser($_POST["email"], $_POST["link_url"]))
          echo json_encode(array("success" => true));
        else
          echo json_encode(array("success" => false));
      }
      else if($subres == "getAll") {
        $links = $db->getLinks($user["email"]);
        echo json_encode(array("success" => true, "links" => $links));
      }
    }
    else
      echo "POST method requests are not accepted for this resource";
      exit();
  }
  else if($_SERVER["REQUEST_METHOD"] == "GET") {
    $status = $db->checkLinkStatus($subres);
    if($status == "Public") {
      $db->downloadFile($subres);
    }
    else if($status == "Restricted" || $status == "Private") {
      $user = $db->verifyToken();
      if($db->isUserAllowed($subres, $user, $status)) {
        $db->downloadFile($subres);
      }
      else {
        echo "You're not allowed to access this resource";
      }
    }
    else
      echo "GET method requests are not accepted for this resource";
    exit();
  }
}

else if($res == "/_session") {
  if($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $db->verifyToken();
    if($user)
      echo json_encode(array("success" => true));
    else
      echo json_encode(array("success" => false));
    exit();
  }
  else if($_SERVER["REQUEST_METHOD"] == "GET") {
    echo "GET method requests are not accepted for this resource";
    exit();
  }
}

else {
  $err = array(
    "error" => array(
      "status" => "404",
      "message" => "Bad URL. Resource '" . $resource . "' not found."
    )
  );  
  echo json_encode($err);
  exit();
}
?>