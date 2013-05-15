<?php 
	require_once("db_util.php");
	$project = $_POST["project"];
	$description = htmlspecialchars($_POST["description"]);
	$hours = htmlspecialchars($_POST["hours"]);

	if ($project!="" && $description != "" && $hours != "") {
		//connect to database
		$db = dbconnect();

		//clean up the input for mysql
	 	$description = $db->real_escape_string($description);

		// add the new project to the project database
		$sql = "INSERT INTO `" . $project . "`(`description`, `hrs`, `paid`) VALUES ('" . $description . "', '" . $hours . "', '0')";
		if(!$result = $db->query($sql)){
			die('There was an error running the query [' . $db->error . ']');
		}
		echo "<p>hours added to the $project table</p>";

		dbclose($result, $db);
	} else {
		echo "no dice";
	}
?>