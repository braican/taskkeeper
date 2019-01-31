<?php
	require_once("db_util.php");
	$new_name = htmlspecialchars($_POST["new_name"]);
	$existing_project = $_POST['old_name'];

	if($new_name){
		$db = dbconnect();
		$sql = "UPDATE projects SET name = '$new_name' WHERE project = '$existing_project'";
		if(!$result = $db->query($sql)){
			die('There was an error while changing the name of the project [' . $db->error . ']');
		}
		echo 0;
	} else {
		echo 1;
	}
	dbclose($result, $db);
?>