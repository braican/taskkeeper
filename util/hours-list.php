<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$project = $_GET["val"];

	$sql = "SELECT SUM(hrs) FROM $project WHERE paid = 0";
	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
	$row = $result->fetch_row();
	$total_hours = $row[0];
?>
	<div class="totals clearfix">
		<div class="row clearfix">
			<div class="title">TOTAL BILLABLE HOURS</div>
			<div class="value total-hours"><?php echo $total_hours + '&nbsp;'; ?></div>
		</div>
		<?php
			$sql = "SELECT rate FROM projects WHERE project = '$project'";
			if(!$result = $db->query($sql)){
				die('There was an error running the query in hours-list.php [' . $db->error . ']');
			}
		?>
		<?php $row = $result->fetch_assoc(); ?>
		<?php $row = $row['rate']; ?>
		<div class="row clearfix">
			<div class="title">RATE</div>
			<div class="value rate">$ <?php echo $row; ?></div>
			
		</div>
		<div class="row clearfix">
			<div class="title">TOTAL DUE</div>
			<div class="value total-due">$ <?php echo $total_hours * $row; ?></div>
			
		</div>
	</div><!-- .totals -->


<?php
	$sql = "SELECT * FROM $project ORDER BY id DESC";

	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
?>

	<table class="hours" cellpadding="0">
		<thead>
			<tr>
				<td width="70%">Description</td>
				<td width="25%">Hours</td>
				<td width="5%">$</td>
			</tr>
		</thead>
		<tbody>
			<?php while($row = $result->fetch_assoc()) : ?>
				<?php $dulled = $row['paid'] == 1 ? 'class="dulled"' : ''; ?>
				<?php $paid = $row['paid'] == 1 ? 'paid' : 'not-paid'; ?>
				<tr <?php echo $dulled ?>>
					<td><?php echo $row['description'] ?></td>
					<td><?php echo $row['hrs'] ?></td>
                    <td class="<?php echo $paid; ?>"></td>
				</tr>
			<?php endwhile; ?>
		</tbody>
	</table>
	
<?php dbclose($result, $db); ?>
