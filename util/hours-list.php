<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$project = $_GET["val"];

	$sql = "SELECT SUM(hrs) FROM $project WHERE paid = 0 AND price = 0.00";
	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
	$row = $result->fetch_row();
	$total_hours = $row[0] != NULL ? $row[0] : 0;
?>
	<div class="totals clearfix">
		<div class="row clearfix">
			<div class="title">TOTAL BILLABLE HOURS</div>
			<div class="value total-hours"><?php echo $total_hours; ?></div>
		</div>
		<?php
			$sql = "SELECT rate FROM projects WHERE project = '$project'";
			if(!$result = $db->query($sql)){
				die('There was an error running the query in hours-list.php [' . $db->error . ']');
			}
		?>
		<?php $row = $result->fetch_assoc(); ?>
		<?php $rate = $row['rate']; ?>
		<div class="row clearfix">
			<div class="title">RATE</div>
			<div class="value rate">$ <?php echo $rate; ?></div>
			
		</div>
		
		<?php 
			$total_due = 0;

			$sql = "SELECT hrs, price FROM $project WHERE paid = 0";
			if(!$result = $db->query($sql)){
				die('There was an error running the query in hours-list.php [' . $db->error . ']');
			}

			while ($row = $result->fetch_assoc()) {
				if($row['price'] == 0.00){
					$total_due += $row['hrs'] * $rate;
				} else {
					$total_due += $row['hrs'] * $row['price'];
				}
			}

		?>

		<div class="row clearfix">
			<div class="title">TOTAL DUE</div>
			<div class="value total-due">$ <?php echo $total_due; ?></div>
			
		</div>
	</div><!-- .totals -->


<?php
	$sql = "SELECT description, hrs, paid FROM $project WHERE price = 0.00 ORDER BY id DESC";

	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
?>

	<table class="hours" cellpadding="0" cellspacing="0">
		<thead>
			<tr class="title-row">
				<td width="68%">Description</td>
				<td width="15%">Hours</td>
				<td width="15%">Subtotal</td>
				<td></td>
			</tr>
		</thead>
		<tr>
			<td colspan="4">
				<div class="scrollable">
					<table width="100%" cellpadding="0" cellspacing="0">
					<?php while($row = $result->fetch_assoc()) : ?>
						<?php $dulled = $row['paid'] == 1 ? 'class="dulled"' : ''; ?>
						<?php $paid = $row['paid'] == 1 ? 'paid' : 'not-paid'; ?>
						<tr <?php echo $dulled ?>>
							<td width="68%"><?php echo $row['description'] ?></td>
							<td width="15%"><?php echo $row['hrs'] ?></td>
							<td width="15%">$<?php echo $row['hrs'] * $rate; ?></td>
			                <td width="2%" class="<?php echo $paid; ?>"></td>
						</tr>

					<?php endwhile; ?>
					</table>	
				</div>
			</td>
		</tr>
		
		<tr class="title-row">
			<td colspan="2">Fixed Price Items</td>
			<td colspan="2">Subtotal</td>
		</tr>
		
		<?php
			$sql = "SELECT description, price, paid FROM $project WHERE hrs = 1.0 and price <> 0.00 ORDER BY id DESC";

			if(!$result = $db->query($sql)){
				die('There was an error running the query in hours-list.php [' . $db->error . ']');
			}
		?>
		<tr>
			<td colspan="4">
				<div class="scrollable">
					<table width="100%" cellpadding="0" cellspacing="0">
					<?php while($row = $result->fetch_assoc()) : ?>
						<?php $dulled = $row['paid'] == 1 ? 'class="dulled"' : ''; ?>
						<?php $paid = $row['paid'] == 1 ? 'paid' : 'not-paid'; ?>
						<tr <?php echo $dulled ?>>
							<td width="83%"><?php echo $row['description'] ?></td>
							<td width="15%">$<?php echo $row['price']; ?></td>
			                <td width="2%" class="<?php echo $paid; ?>"></td>
						</tr>
					<?php endwhile; ?>
					</table>
				</div>
			</td>
		</tr>
	</table>
<?php dbclose($result, $db); ?>
