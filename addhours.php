
<?php include('includes/header.html'); ?>
	
	<?php
		require_once("util/db_util.php");
		$db = dbconnect();
		$db_name = $_GET['val'];
		$sql = "SELECT `name` FROM `projects` WHERE `project` = '" . $db_name . "'";
		if(!$result = $db->query($sql)){
			die('There was an error running the query [' . $db->error . ']');
		}

		while($row = $result->fetch_assoc()) :
			$name = $row['name'];
	?>
	
	<h1><?php echo $name ?></h1>

	<?php
		endwhile;
		
		dbclose($result, $db);
	?>
	
	<p>back to <a href="index.php" class="link" title="">project list</a></p>
	<div class="hours-list">
		<?php include("util/hours-list.php"); ?>
	</div>
	
	<form action="util/add_hours.php" method="post" class="addhours-form" id="add-hours">
		
		<input type="text" name="description" placeholder="description"></input>
		<input type="text" name="hours" placeholder="number of hours"></input>
		<input type="hidden" name="project" value="<?php echo $project; ?>">
		<input type="submit" value="Submit"></input>
	</form>

	<div class="success-text"></div>
	
	<div class="get-paid" data-project="<?php echo $project; ?>">GET PAID!</div>
	<div class="success-payed-text"></div>

<?php include('includes/footer.html'); ?>
