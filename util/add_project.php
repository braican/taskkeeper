<?php 
	require_once("db_util.php");
	$proj_name = htmlspecialchars($_POST["new_project"]);
	$new_project = str_replace(array(' ', '_'), '_', $proj_name);
	$new_project = strtolower($new_project);
	
	$rate = $_POST["rate"];

	if ($new_project!="") {
		//connect to database
		$db = dbconnect();

		//clean up the input for mysql
	 	$new_project = $db->real_escape_string($new_project);

	 	// check if the potential project exists in the database
	 	$sql = "SELECT COUNT( * ) FROM projects WHERE project = '$new_project'";
	 	//$sql = "SELECT * FROM  `projects`";
	 	$result = $db->query($sql);
		$row = $result->fetch_row();
		if($row[0] > 0){
			die('no dice, already a project with that name');
		}

		// add the new project to the project database
		$sql = "INSERT INTO projects(project, name , rate) VALUES ('$new_project', '$proj_name', '$rate')";

		echo $sql;
		if(!$result = $db->query($sql)){
			die('There was an error running the query in add_project [' . $db->error . ']');
		}
		echo "<p>project $new_project added to the projects table</p>";

		// create the table
		$sql = "CREATE TABLE " . $new_project . " (id BIGINT( 20 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,description TEXT, hrs DECIMAL(5,1), paid INT)";
		if(!$result = $db->query($sql)){
			die('There was an error running the query in add_project [' . $db->error . ']');
		}
		echo "<p>table $new_project created</p>";

		dbclose($result, $db);
	}
?>
