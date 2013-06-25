<?php
	require_once("db_util.php");
	$project = $_POST['old_name'];

	$db = dbconnect();
	$sql = "DELETE FROM projects WHERE project = '$project'";
	$sql2 = "DROP TABLE $project";
	//echo $sql;
	if(!$result = $db->query($sql)){
	 	die('There was an error while deleting the project from the projects table [' . $db->error . ']');
	}
	if(!$result = $db->query($sql2)){
	 	die('There was an error deleting the ' . $projects . ' table - [' . $db->error . ']');
	}
	echo 0;
	
	dbclose($result, $db);
?>