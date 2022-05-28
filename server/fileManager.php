<?php
class FileManager {
    private $folderPath;
	private $db;
	private $email; 

	public function __construct($email){
		$this->folderPath = "/home/v/ftp/".$email;
		$this->email = $email;
		$this->db = new Database();
	}
	
    public function uploadFolder($uploads){
		$paths = explode("###",rtrim($_POST['paths'],"###"));
		foreach($uploads as $key => $current)
		{
			$this->uploadFile=$this->folderPath."/".rtrim($paths[$key],"/.");
			$this->folder = substr($this->uploadFile,0,strrpos($this->uploadFile,"/"));		
			if(strlen($current['name'])!=1)
				$this->upload($current,$this->uploadFile);
		}
	}

	private function upload($current,$uploadFile){
		$currentFolder = $this->folderPath;
		$paths = explode("/",$this->folder);
		for ($i=5; $i<count($paths); $i++) {
			$currentFolder = $currentFolder."/".$paths[$i];
			if(!is_dir($currentFolder)){
				mkdir($currentFolder,0777,true);
				chown($currentFolder,"v");
				$this->db->addFolder($this->email, $currentFolder);
			}
		}
		if(move_uploaded_file($current['tmp_name'],$uploadFile)) {
			$this->db->addFile($this->email, str_replace($current["name"], "", $uploadFile), $current);
            chown($uploadFile,"v");
            return true;
        }
		else 
			return false;
	}

	public function uploadFile($current){
		foreach($current as $file) {
			if(!is_dir($this->folderPath)){
				mkdir($this->folderPath,0777,true);
				chown($this->folderPath,"v");
			}
			if(move_uploaded_file($file['tmp_name'],$this->folderPath."/".$file['name'])) {
				$this->db->addFile($this->email, str_replace($file["name"], "", $this->folderPath."/".$file['name']), array("name" => $file["name"], "size" => $file["size"]));
				chown($this->folderPath.$file['name'],"v");
			}
		}
		return;
	}

	public function download($filename, $path, $file_type) {
		$fileLocation = $this->folderPath.$path.$filename;
		var_dump($fileLocation);
		if (file_exists($fileLocation)) {
			if($file_type == "dir") {
				$zipFilename = "./".$filename.".zip";
				$rootPath = realpath($fileLocation);
				$zip = new ZipArchive();
				if($zip->open($zipFilename, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
					// Create recursive directory iterator
					/** @var SplFileInfo[] $files */
					$files = new RecursiveIteratorIterator(
						new RecursiveDirectoryIterator($rootPath),
						RecursiveIteratorIterator::LEAVES_ONLY
					);
					foreach ($files as $name => $file)
					{
						if (!$file->isDir())
						{
							$filePath = $file->getRealPath();
							$relativePath = substr($filePath, strlen($rootPath) + 1);
							$zip->addFile($filePath, $relativePath);
						}
					}
					$zip->close();
					header('Content-Type: application/zip');
					header("Content-Transfer-Encoding: Binary");
					header('Content-Length: ' . filesize($zipFilename));
					header('Content-Disposition: attachment; filename="'.$filename.'.zip"');
					readfile($zipFilename);
					unlink($zipFilename);
				}
			}
			else {
				header('Content-Description: File Trasnsfer');
				header('Content-Type: application/zip');
				header("Content-Transfer-Encoding: Binary");
			    header('Content-Disposition: attachment; filename="'.basename($fileLocation).'"');
				header('Expires: 0');
				header('Cache-Control: must-revalidate');
				header('Pragma: public');
				header('Content-Length: ' . filesize($fileLocation));
				readfile($fileLocation);
				exit;
			}
        }
	}

	public function showFolder($path) {
		$currentDir = $this->folderPath.$path;
		if(is_dir($currentDir)) {
			$fileStatuses = $this->db->getFilesStatus($path);
			$files = scandir($currentDir);
			$files = array_diff($files, array('.', '..'));
			$files = array_values($files);
			$files = array_map(function($file) use($currentDir, $fileStatuses) {
				$array = array();
				$array['filename'] = $file;
				$array['type'] = filetype($currentDir."/".$file);
				$array['size'] = filesize($currentDir."/".$file);
				$array['lastModified'] = filemtime($currentDir."/".$file);
				$array['status'] = array_key_exists($file, $fileStatuses) ? $fileStatuses[$file] : 'not set';
				return $array;
			}, $files);
			echo json_encode($files);
		}
	}

	public function update($oldName,$newName, $path, $type) {
		$oldPath = $this->folderPath.$path."/".$oldName;
		$newPath = $this->folderPath.$path."/".$newName;
		if(rename($oldPath,$newPath)) {
			if($type == "dir" ) {
				$this->db->renameFolder($oldName, $newName, str_replace("//","/",$path."/"), $this->email);
				$this->db->renameFile($oldName, $newName, str_replace("//","/",$path."/"), $this->email);
				echo json_encode("Folder renamed successfully");
			}
			else{
				$this->db->renameFile($oldName, $newName, str_replace("//","/",$path."/"), $this->email);
				echo json_encode("File renamed successfully");
			}
		}
		else 
			echo json_encode("Error");
	}

	public function copyAndPaste($filename, $oldPath, $newPath, $size) {
		$fileOrigin = $this->folderPath.$oldPath.$filename;
		$fileDestination = $this->folderPath.$newPath.$filename;

		if(copy($fileOrigin, $fileDestination)) {
			echo json_encode("File copied successfully");
			$this->db->addFile($this->email, $newPath, array("name" => $filename, "size" => $size));
		}
		else {
			echo json_encode("Couldn't copy file");
		}
	}

	public function cutAndPaste($filename, $oldPath, $newPath) {
		$fileOrigin = $this->folderPath.$oldPath.$filename;
		$fileDestination = $this->folderPath.$newPath.$filename;

		if(rename($fileOrigin, $fileDestination)) {
			echo json_encode("File cut successfully");
			$this->db->moveFile($oldPath, $newPath, $filename, $this->email);
		}
		else {
			echo json_encode("Couldn't cut file");
		}
	}

	function rrmdir($dir) { 
		if (is_dir($dir)) { 
		  $objects = scandir($dir);
		  foreach ($objects as $object) { 
			if ($object != "." && $object != "..") { 
			  if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir."/".$object))
				$this->rrmdir($dir. DIRECTORY_SEPARATOR .$object);
			  else
				unlink($dir. DIRECTORY_SEPARATOR .$object); 
			} 
		  }
		  if(rmdir($dir)) 
		  	return true;
		  else
		  	return false;
		} 
	}

	public function delete($filename, $path, $type) {
		$fileLocation = $this->folderPath.$path."/".$filename;
		if($type == "dir" && $this->rrmdir($fileLocation)) {
			$this->db->deleteFolder($filename, $path, $this->email);
			$this->db->deleteFile($filename, $path, $this->email);
			echo json_encode("Folder deleted successfully");
		}
		
		else if (unlink($fileLocation)) {
			$this->db->deleteFile($filename, $path, $this->email);
			echo json_encode("File deleted successfully");
		}
	}
}
?>