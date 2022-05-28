<?php
session_start();
require "./vendor/autoload.php";
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
class Database {
    private $conn;
    private $folderPath = "../ftp/";

    public function __construct() {
        $db = json_decode(file_get_contents("../config.json"), true);
        try {
            $this->conn = new PDO('mysql:host=' . $db["host"] . ';dbname=' . $db["database"], $db["username"], $db["password"]);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }

    public function loginUser($user) {
        $query = $this->conn->prepare("SELECT * FROM `user` WHERE `email` = '".$user["email"]."'");
        try {
            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0) {
                return null;
            }
            else {
                if(password_verify($user["password"], $result[0]["password"])) {
                    $_SESSION["email"] = $result[0]["email"];
                    $config = json_decode(file_get_contents("../config.json"), true);
                    $secret_key = $config["jwt_secret"];
                    $issuer_claim = "https://smartlink-site.it/_session";
                    $audience_claim = "https://smartlink-site.it";
                    $issuedat_claim = time(); 
                    $notbefore_claim = 1356999524; 
                    $token = array(
                        "iss" => $issuer_claim,
                        "aud" => $audience_claim,
                        "iat" => $issuedat_claim,
                        "nbf" => $notbefore_claim,
                        "data" => array(
                            "username" =>  $result[0]["username"],
                            "email" => $result[0]["email"],
                            "user_creation_date" => $result[0]["user_creation_date"],

                    ));
                    $jwt = JWT::encode($token, $secret_key, "HS256");
                    return array(
                        "success" => true,
                        "message" => "Successful login.",
                        "jwt" => $jwt,
                    );
                }
                else {
                    return null;
                }
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }
    public function registerUser($user) {
        $query = $this->conn->prepare("INSERT INTO `user` (`username`, `email`, `password`, `user_creation_date`) VALUES (:username, :email, :password, :user_creation_date)");
        try {
            $res = $query->execute(array(
                ':username' => $user["username"], 
                ':email' => $user["email"],
                ':password' => password_hash($user['password'], PASSWORD_DEFAULT), 
                ':user_creation_date' => date("Y-m-d H:i:s")
            ));
            if($res) {
                $query2 = $this->conn->prepare("SELECT `settings`.`setting_id` FROM `settings`");
                try {
                    $query2->execute();
                    $result = $query2->fetchAll(PDO::FETCH_ASSOC);
                    $query3 = $this->conn->prepare("INSERT INTO `user_settings`(`email`, `setting_id`, `value`) VALUES (:email, :setting_id, :value)");
                    try {
                        foreach($result as $setting) {
                            $res = $query3->execute(array(
                                ':email' => $user["email"], 
                                ':setting_id' => $setting["setting_id"], 
                                ':value' => 0, 
                            ));
                        }
                        return array(
                            "success" => true,
                            "message" => "Successful registration."
                        );
                    } catch(PDOException $e) {
                        echo 'Connection Error: ' . $e->getMessage();
                    }
                } catch(PDOException $e) {
                    echo 'Connection Error: ' . $e->getMessage();
                    return null;
                }
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function verifyToken() {
        $jwt = null;
        if($_COOKIE["loginToken"]) {
            $jwt = $_COOKIE["loginToken"];
        }
        else if(!$_POST["jwt"]) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
            $arr = explode(" ", $authHeader);
            $jwt = $arr[1];        
        } 
        else {
            $jwt = $_POST["jwt"];
        }
        
        if($jwt){  
            try {
                $config = json_decode(file_get_contents("../config.json"), true);
                $secret_key = $config["jwt_secret"];
                $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));
                $db = new Database();
                return array(
                    "success" => true,
                    "message" => "Access granted.",
                    "username" => $decoded->data->username,
                    "email" => $decoded->data->email,
                    "user_creation_date" =>$decoded->data->user_creation_date,
                    "pageTheme" => $db->getUserSettings($decoded->data->email)[0]["value"]
                );
            }
            catch (Exception $e){
                http_response_code(401);           
                return array(
                    "message" => "Access denied.",
                    "error" => $e->getMessage()
                );
            }
        }
    }

    public function getUserSettings($email) {
        $query = $this->conn->prepare("SELECT `user_settings`.`setting_id`, `user_settings`.`value`, `settings`.`setting_description` FROM `user_settings` JOIN `user` ON (`user_settings`.`email` = `user`.`email`) JOIN `settings` ON (`user_settings`.`setting_id` = `settings`.`setting_id`) WHERE `user_settings`.`email` = :email");
        try {
            $query->execute(array(
                ':email' => $email
            ));
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0) {
                return null;
            }
            else {
                foreach($result as $setting => $value) {
                    $result[$setting]["value"] = $value["value"] == 0 ? 'false' : 'true';
                }
                return $result;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }
    public function updateUserSettings($user) {
        $query = $this->conn->prepare("UPDATE `user_settings` SET `value` = :value WHERE `email` = :email AND `setting_id` = :setting_id");
        try {
          foreach(json_decode($_POST["settings"], true) as $setting) {
            $setting["value"] = $setting["value"] == 'false' ? 0 : 1;
            $query->execute(array(
              ':email' => $user["email"],
              ':setting_id' => $setting["setting_id"],
              ':value' =>$setting["value"]
            ));
          }
          return array(
            "success" => true,
            "message" => "Successful update."
          );  
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }

    public function checkLink($filename, $file_location) {
        $query = $this->conn->prepare("SELECT `link`.`link_url`, `link`.`visibility`, `link`.`expiration_date` FROM `storage` JOIN `file` ON (`storage`.`file_id` = `file`.`file_id`) JOIN `link` ON (`storage`.`link_url` = `link`.`link_url`) WHERE `file`.`filename` = :filename AND `file`.`file_location` = :file_location");
        try {
            $query->execute(array(
                ':filename' => $filename,
                ':file_location' => str_replace("//", "/", $file_location."/"),                
            ));
            $link_url= $query->fetchAll(PDO::FETCH_ASSOC)[0];
            if($link_url) {
                $link_url["link_url"] = "https://smartlink-site.it/_shared/".$link_url["link_url"];
                return $link_url;
            }
            else {
                return false;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }
    public function createLink($email, $filename, $file_location) {
        $id = uniqid();
        $exp = date("Y-m-d H:i:s", time() + (60 * 60 * 24 * 7));
        $query = $this->conn->prepare("INSERT INTO `link`(`link_url`, `visibility`, `expiration_date`) VALUES (:link_url, :visibility, :expiration_date)");
        try {
            $res = $query->execute(array(
                ':link_url' => $id, 
                ':visibility' => "private", 
                ':expiration_date' => $exp, 
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
        $query2 = $this->conn->prepare("SELECT `file`.`file_id` FROM `file` WHERE `file`.`filename` = :filename AND `file`.`file_location` = :file_location");
        try {
            $res = $query2->execute(array(
                ':filename' => $filename,
                ':file_location' => str_replace("//", "/", $file_location."/"),                
            ));
            $file_id= $query2->fetchAll(PDO::FETCH_ASSOC)[0]["file_id"];

            if($res) {
                $query3 = $this->conn->prepare("UPDATE `storage` SET `storage`.`link_url` = :link_url WHERE `storage`.`email` = :email AND `storage`.`file_id` = :file_id");
                
                $res2 = $query3->execute(array(
                    ':link_url' => $id, 
                    ':email' => $email,
                    ':file_id' => $file_id,     
                ));
                if($res2) {
                    return array("link_url" => "https://smartlink-site.it/_shared/".$id, "visibility" => "private", "expiration_date" => $exp);
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function updateLink($link_url, $visibility) {
        $query = $this->conn->prepare("UPDATE `link` SET `link`.`visibility` = :visibility WHERE `link`.`link_url` = :link_url");
        try {
            $link_id = str_replace("https://smartlink-site.it/_shared/", "", $link_url);
            $res = $query->execute(array(
                ':link_url' => $link_id, 
                ':visibility' => $visibility,
            ));
            if($res) {
                return true;
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function getLink($link_url) {
        $query = $this->conn->prepare("SELECT `link`.`visibility`, `link`.`expiration_date` FROM `link` WHERE `link`.`link_url` = :link_url");
        try {
            $link_id = str_replace("https://smartlink-site.it/_shared/", "", $link_url);
            $query->execute(array(
                ':link_url' => $link_id,
            ));
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0) {
                return null;
            }
            else {
                return $result[0];
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }
    public function getLinks($email) {
        $query = $this->conn->prepare("SELECT `link`.`link_url`, `file`.`filename`, `file`.`file_location`, `file`.`file_type`, `file`.`file_size`, `file`.`upload_date`,`link`.`visibility`, `link`.`expiration_date` FROM `link` JOIN `storage` ON (`link`.`link_url` = `storage`.`link_url`) JOIN `file` ON (`storage`.`file_id` = `file`.`file_id`) WHERE `storage`.`email` = :email AND `link`.`visibility` != 'private'");
        try {
            $query->execute(array(
                ':email' => $email,
            ));
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0) {
                return null;
            }
            else {
                return $result;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
            return null;
        }
    }
    public function allowUser($email, $link_url) {
        $query = $this->conn->prepare("SELECT * FROM `storage` WHERE `storage`.`link_url` = :link_url");
        try {
            $query->execute(array(
                ':link_url' => str_replace("https://smartlink-site.it/_shared/", "", $link_url), 
            ));
            $result = $query->fetchAll(PDO::FETCH_ASSOC)[0];
            $query2 = $this->conn->prepare("INSERT INTO `storage`(`email`, `file_id`, `owner`) VALUES (:email, :file_id, :owner)");
            try {
                $res = $query2->execute(array(
                    ':email' => $email, 
                    ':file_id' => $result["file_id"],
                    ':owner' => 0,
                ));
                if($res) {
                    return true;
                }
                else {
                    return null;
                }
            } catch(PDOException $e) {
                echo 'Connection Error: ' . $e->getMessage();
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function unallowUser($email, $link_url) {
        $query = $this->conn->prepare("SELECT T.file_id FROM `storage` T JOIN storage T1 ON T.file_id=T1.file_id WHERE T1.`link_url` = :link_url AND T.`email` = :email AND T.`owner` = 0");
        try {
            $query->execute(array(
                ':link_url' => str_replace("https://smartlink-site.it/_shared/", "", $link_url), 
                ':email' => $email,
            ));
            $result = $query->fetchAll(PDO::FETCH_ASSOC)[0];
            if($result) {
                $query2 = $this->conn->prepare("DELETE FROM `storage` WHERE `storage`.`file_id` = :file_id AND `storage`.`email` = :email AND `storage`.`owner` = 0");
                try {
                    $res = $query2->execute(array(
                        ':file_id' => $result["file_id"],
                        ':email' => $email,
                    ));
                    if($res) {
                        return true;
                    }
                    else {
                        return null;
                    }
                }
                catch(PDOException $e) {
                    echo 'Connection Error: ' . $e->getMessage();
                }
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function getUsers($user) {
        $query = $this->conn->prepare("SELECT file.filename, file.file_location, file.file_size, file.file_type, file.upload_date, T2.email FROM file JOIN storage T1 ON (T1.file_id = file.file_id) JOIN storage T2 ON (T2.file_id = file.file_id) JOIN link ON (T2.link_url = link.link_url) WHERE T1.email = :email AND T1.owner = 0 AND T2.owner = 1 AND link.visibility = 'Restricted'");
        try {
            $query->execute(array(
                ':email' => $user["email"]
            ));
            $res = $query->fetchAll(PDO::FETCH_ASSOC);
            if($res) {
                $array = array();
                foreach($res as $value) {
                    if(!array_key_exists($value["email"], $array)) 
                        $array[$value["email"]] = array();
                    array_push($array[$value["email"]], ["file_id" => $value["file_id"], "filename" => $value["filename"], "file_location" => $value["file_location"],"file_size" => $value["file_size"], "file_type" => $value["file_type"], "upload_date" => $value["upload_date"]]);
                }
                return $array;
            }
            else
                return null;
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
        
    }
    public function getSharedUsers($link_url) {
        $query = $this->conn->prepare("SELECT T1.email FROM storage T JOIN storage T1 ON (T1.file_id = T.file_id) WHERE T.link_url = :link_url AND T1.owner = 0");
        try {
            $query->execute(array(
                ':link_url' => str_replace("https://smartlink-site.it/_shared/", "", $link_url)
            ));
            $res = $query->fetchAll(PDO::FETCH_ASSOC);
            if($res) {
                return $res;
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }


    public function addFolder($email, $folder) {
        $id = uniqid();
        $query = $this->conn->prepare("INSERT INTO `file`(`file_id`, `filename`, `file_type`, `file_size`, `file_location`, `upload_date`) VALUES (:file_id, :filename, :file_type, :file_size, :file_location, :upload_date)");
        try {
            $folder = str_replace($this->folderPath.$email, "/", $folder);
            $paths = explode("/",$folder);
            $filename = array_pop($paths);
            $file_location = implode("/", $paths)."/";
            $file_location = str_replace("//", "/", $file_location);
            $res = $query->execute(array(
                ':file_id' => $id, 
                ':filename' => $filename,
                ':file_type' => "dir",
                ':file_size' => "0",
                ':file_location' => $file_location,
                ':upload_date' => date("Y-m-d H:i:s")
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    
        $query2 = $this->conn->prepare("INSERT INTO `storage`(`email`, `file_id`, `owner`) VALUES (:email, :file_id, :owner)");
        try {
            $res = $query2->execute(array(
                ':email' => $email, 
                ':file_id' => $id,
                ':owner' => 1,
                
            ));
            if($res) {
                $this->createLink($email, $filename, $file_location);
                return true;
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function addFile($email, $folder, $file) {
        $id = uniqid();
        $query = $this->conn->prepare("INSERT INTO `file`(`file_id`, `filename`, `file_type`, `file_size`, `file_location`, `upload_date`) VALUES (:file_id, :filename, :file_type, :file_size, :file_location, :upload_date)");
        try {

            $folder = str_replace($this->folderPath.$email, "/", $folder);
            $file_location = str_replace("//", "/", $folder);

            $res = $query->execute(array(
                ':file_id' => $id, 
                ':filename' => $file["name"],
                ':file_type' => "file",
                ':file_size' => $file["size"],
                ':file_location' => $file_location,
                ':upload_date' => date("Y-m-d H:i:s")
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }

        $query2 = $this->conn->prepare("INSERT INTO `storage`(`email`, `file_id`, `owner`) VALUES (:email, :file_id, :owner)");
        try {
            $res = $query2->execute(array(
                ':email' => $email, 
                ':file_id' => $id,
                ':owner' => 1,
            ));
            if($res) {
                $this->createLink($email, $file["name"], $file_location);
                return true;
            }
            else {
                return null;
            }
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function renameFile($oldName, $newName, $path, $email) {
        $query = $this->conn->prepare("UPDATE `file` JOIN storage ON `file`.`file_id` = `storage`.`file_id` SET `filename` = REPLACE(`filename`, :oldName, :newName) WHERE `filename` = :oldName AND `file_location` = :path AND `storage`.`email` = :email");
        try {
            $res = $query->execute(array(
                ':oldName' => $oldName,
                ':newName' => $newName,
                ':path' => $path,
                ':email' => $email,
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function renameFolder($oldName, $newName, $path, $email) {
        $this->conn->query("UPDATE `file` JOIN storage ON `file`.`file_id` = `storage`.`file_id` SET `file_location` = REPLACE(`file_location`, '".$oldName."', '".$newName."') WHERE `file_location` LIKE '%".$path.$oldName."%' AND `storage`.`email` = '".$email."'");
    }
    public function moveFile($oldPath, $newPath, $name, $email) {
        $query = $this->conn->prepare("UPDATE `file` JOIN storage ON `file`.`file_id` = `storage`.`file_id` SET `file_location` = REPLACE(`file_location`, :oldPath, :newPath) WHERE `filename` = :name AND `storage`.`email` = :email");
        try {
            $query->execute(array(
                ':oldPath' => $oldPath,
                ':newPath' => $newPath,
                ':name' => $name,
                ':email' => $email,
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function deleteFile($filename, $path, $email) {
        $query = $this->conn->prepare("DELETE `file`, `storage` FROM `file` JOIN storage ON `file`.`file_id` = `storage`.`file_id` WHERE `filename` = :filename AND `file_location` = :path AND `storage`.`email` = :email");
        try {
            $res =$query->execute(array(
                ':filename' => $filename,
                ':path' => $path,
                ':email' => $email,
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }
    public function deleteFolder($filename, $path, $email) {
        $query = $this->conn->prepare("DELETE `file` FROM `file` JOIN storage ON `file`.`file_id` = `storage`.`file_id` WHERE `file_location` LIKE '%".$path.$filename."%' AND `storage`.`email` = :email");
        try {
            $res = $query->execute(array(
                ':email' => $email,
            ));
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }

    public function getFilesStatus($file_location) {
        $query = $this->conn->prepare("SELECT `file`.`filename`, `link`.`visibility` FROM `file` JOIN `storage` ON (`file`.`file_id` = `storage`.`file_id`) JOIN `link` ON (`storage`.`link_url` = `link`.`link_url`) WHERE`file`.`file_location` = :file_location");
        try {
            $query->execute(array(
                ':file_location' => $file_location,
            ));
            $res = $query->fetchAll(PDO::FETCH_ASSOC);
            $array = array();
            foreach($res as $row) {
                $array[$row["filename"]] = $row["visibility"];
            }
            return $array;
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
    }

    public function checkLinkStatus($link_id) {
        $query = $this->conn->query("SELECT * FROM link WHERE link_url = '".$link_id."'");
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if(!$result) {
            return false;
        }
        else {
            return $result[0]["visibility"];
        }
    }

    public function isUserAllowed($link_id, $user, $status) {
        $query = $this->conn->query("SELECT * FROM storage WHERE link_url = '".$link_id."'");
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        $query2 = $this->conn->query("SELECT * FROM storage WHERE file_id = '".$result[0]["file_id"]."'");
        $result2 = $query2->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result2 as $row) {
            if($status == "Private" && $row["email"] == $user["email"] && $row["owner"] == 1) {
                return true;
            }          
            else if($status == "Restricted" && $row["email"] == $user["email"]) {
                return true;
            }
        }
        return false;
    }

    public function downloadFile($link_id) {
        $query = $this->conn->query("SELECT storage.email, file.filename, file.file_location, file.file_type FROM storage JOIN file ON (storage.file_id = file.file_id) WHERE link_url = '".$link_id."' AND storage.owner = 1");
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        $fileManager = new FileManager($result[0]["email"]);
        $fileManager->download($result[0]["filename"], $result[0]["file_location"], $result[0]["file_type"]);
    }
}
?>