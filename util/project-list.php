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
		$rate = $row['rate'];
		$invoice = $row['outbound_invoice'];

		$paid_sql = "SELECT SUM(hrs) FROM  $db_name WHERE  paid = 0";
		if(!$paid_result = $db->query($paid_sql)){
			die('There was an error running the query "SELECT COUNT(paid) FROM $db_name WHERE paid = 0" - [' . $db->error . ']');
		}
		while($paid_row = $paid_result->fetch_row()){
			$paid_num = $paid_row[0];
			$paid_num = $paid_num * 2;
			$paid_class = $paid_num != 0 ? 'owed' : 'no-money';
		
?>
	<div class="clearfix project" id="<?php echo $db_name; ?>">
		<a class="<?php echo $paid_class; ?>" style="border-right-width:<?php echo $paid_num;?>px;" href="addhours.php?val=<?php echo $db_name ?>"><?php echo $name ?> <?php if($invoice == 1) : ?><span class="invoice">invoice on its way</span><?php endif; ?></a>
		<div class="util">
			<span class="rate-amt">$ <?php echo $rate; ?></span>
			<span class="rename">rename</span>
			<span class="delete">delete</span>
		</div>
	</div>
	

<?php
		}
	} 
	
	dbclose($result, $db);
?>