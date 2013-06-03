<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$sql = "SELECT * FROM `projects`";
	if(!$result = $db->query($sql)){
		die('There was an error running the query [' . $db->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$name = $row['name'];
		$db_name = $row['project'];
?>
	<a href="addhours.php?val=<?php echo $db_name ?>"><?php echo $name ?></a>

<?php
	} 
	
	dbclose($result, $db);
?>