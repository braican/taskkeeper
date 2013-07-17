
<?php include('includes/header.html'); ?>
	
	<?php
		require_once("util/db_util.php");
		$db = dbconnect();
		$project = $_GET['val'];
		$sql = "SELECT name, outbound_invoice FROM projects WHERE project = '$project'";
		if(!$result = $db->query($sql)){
			die('There was an error running the query [' . $db->error . ']');
		}

		while($row = $result->fetch_assoc()) :
			$name = $row['name'];
			$invoice = $row['outbound_invoice'];
	?>
	
	<h1><?php echo $name ?> <span class="waiting-on-invoice <?php if($invoice == 0) echo 'hide'; ?>">invoice inbound</span></h1>

	<?php
		endwhile;
		
		dbclose($result, $db);
	?>
	
	<p>Back to the<a href="index.php" class="link" title="">list of projects</a></p>
	<div class="form-header">Add some hours:</div>
	<form action="util/add_hours.php" method="post" class="addhours-form" id="add-hours">
		<input type="text" name="description" placeholder="description">
		<input type="text" name="hours" placeholder="number of hours">
		<input type="text" name="price" placeholder="price">
		<input type="hidden" name="project" value="<?php echo $project; ?>">
		<input type="submit" value="Submit">
	</form>
	
	<div class="get-paid <?php if($invoice == 0) echo 'hide';?>" data-project="<?php echo $project; ?>">GET PAID!</div>
	<div class="outbound-invoice <?php if($invoice == 1) echo 'hide';?>" data-project="<?php echo $project; ?>">Waiting on invoice?</div>

	<div class="hours-list">
		<?php include("util/hours-list.php"); ?>
	</div>

<?php include('includes/footer.html'); ?>
