<?php 

	require_once("db_util.php");
	$db = dbconnect();
	
	$project = $_GET["val"];

	$sql = "SELECT * FROM `" . $project . "`";

	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
?>

<?php if($result) : ?>

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
			<?php
				$sql = "SELECT SUM(hrs) FROM `" . $project . "` WHERE paid = 0";
				if(!$result = $db->query($sql)){
					die('There was an error running the query in hours-list.php [' . $db->error . ']');
				}
				$row = $result->fetch_row();
				$total_hours = $row[0];
			?>
		<tfoot>
			<tr>
				<td>TOTAL BILLABLE HOURS</td>
				<td class="total_hours"><?php echo $total_hours; ?></td>
				<td></td>
			</tr>
		

<?php endif; ?>


<?php 
	
	$sql = "SELECT `rate` FROM `projects` WHERE `project` = '$project'";
	if(!$result = $db->query($sql)){
		die('There was an error running the query in hours-list.php [' . $db->error . ']');
	}
?>
<?php if($result) : ?>
	<?php $row = $result->fetch_assoc(); ?>
	<?php $row = $row['rate']; ?>
		<tr>
			<td>RATE</td>
			<td class="rate">$ <?php echo $row; ?></td>
			<td></td>
		</tr>
		<tr>
			<td>TOTAL DUE</td>
			<td class="total_due">$ <?php echo $total_hours * $row; ?></td>
			<td></td>
		</tr>
<?php endif; ?>
	</tfoot>
</table>
			


	
<?php dbclose($result, $db); ?>
