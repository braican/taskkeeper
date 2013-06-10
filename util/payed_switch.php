<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$project = $_POST["project"];

	echo $project;

	$sql = "UPDATE `" . $project . "` SET `paid`=1 WHERE `paid` = 0";

	if(!$result = $db->query($sql)){
		die('There was an error running the query in payed-switch.php [' . $db->error . ']');
	}

	dbclose($result, $db);
?>