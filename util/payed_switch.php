<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$project = $_POST["project"];
	if(isset($_POST['hold']))
		$ids = $_POST['hold'];

	if(!isset($ids) || !$ids){
		$ids = 0;	
	}
	echo $project;

	if(isset($_GET['get-paid'])){
		$sql = "UPDATE $project SET paid = 1 WHERE paid = 0 and id NOT IN ($ids); UPDATE projects SET outbound_invoice = 0 WHERE project = '$project'";	
	} else {
		$sql = "UPDATE projects SET outbound_invoice = 1 WHERE project = '" . $project . "'";
	}
	
	echo $sql;
	if(!$result = $db->multi_query($sql)){
		die('There was an error running the query in payed-switch.php [' . $db->error . ']');
	}

	dbclose($result, $db);
?>