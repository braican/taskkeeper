<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$sql = "SELECT * FROM projects";
	if(!$result = $db->query($sql)){
		die('There was an error running the query "SELECT * FROM projects" - [' . $db->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$name = $row['name'];
		$db_name = $row['project'];

		$paid_sql = "SELECT COUNT('paid') FROM  $db_name WHERE  paid = 0";
		if(!$paid_result = $db->query($paid_sql)){
			die('There was an error running the query "SELECT COUNT(paid) FROM $db_name WHERE paid = 0" - [' . $db->error . ']');
		}

		while($paid_row = $paid_result->fetch_row()){
			$paid_num = $paid_row[0];
			$paid_class = $paid_num > 0 ? 'owed' : 'no-money';
		
?>
	<div>
		<a class="<?php echo $paid_class; ?>" href="addhours.php?val=<?php echo $db_name ?>"><?php echo $name ?></a>
	</div>
	

<?php
		}
	} 
	
	dbclose($result, $db);
?>