<?php 

function dbconnect () {
	$db = new mysqli("localhost", "braican1_braican", "wonton820", "braican1_taskkeeper");
	if ($db->connect_errno) {
	    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
	}
	return $db;
}

function dbclose ($result, $db) {
	if($result && is_object($result)) $result->free();

	if($db) $db->close();
}

?>