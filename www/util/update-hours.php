<?php
	require_once("db_util.php");
	$project = $_POST['project_name'];
	$id = $_POST['description_id'];
	$new_hrs = $_POST['new_hours'];

	$db = dbconnect();
	$sql = "UPDATE $project SET hrs = $new_hrs WHERE id = $id";
	
	// echo $sql;
	if(!$result = $db->query($sql)){
	 	die('There was an error while deleting the project from the projects table [' . $db->error . ']');
	}

	echo 0;
	
	dbclose($result, $db);
?>