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


	<div class="description-list hours">
		<div class="row title-row clearfix">
			<div class="description">Description</div>
			<div class="num-hours">Hours</div>
			<div class="subtotal">Subtotal</div>
		</div>
		<div class="descriptions">
			<?php
				$sql = "SELECT id, description, hrs FROM $project WHERE price = 0.00 and paid = 0 ORDER BY id DESC";

				if(!$result = $db->query($sql)){
					die('There was an error running the query in hours-list.php [' . $db->error . ']');
				}
			?>
			<?php while($row = $result->fetch_assoc()) : ?>
				<div class="row clearfix" data-id="<?php echo $row['id']; ?>">
					<div class="hidden-util">
						<span class="hold">hold</span>
						<span class="dull">dull</span>
					</div>
					<div class="description"><?php echo $row['description'] ?></div>
					<div class="num-hours"><?php echo $row['hrs'] ?></div>
					<div class="subtotal">$<?php echo $row['hrs'] * $rate; ?></div>
				</div>

			<?php endwhile; ?>
		</div><!-- .descriptions -->
	</div><!-- /.description-list /.hours -->

	<div class="description-list fixed-price">
		<div class="row title-row clearfix">
			<div class="description">Fixed Price Item</div>
			<div class="subtotal">Subtotal</div>
		</div>
		
		<div class="descriptions">
			<?php
				$sql = "SELECT id, description, price FROM $project WHERE hrs = 1.0 and price <> 0.00 and paid = 0 ORDER BY id DESC";

				if(!$result = $db->query($sql)){
					die('There was an error running the query in hours-list.php [' . $db->error . ']');
				}
			?>
			<?php while($row = $result->fetch_assoc()) : ?>
				<div class="row clearfix" data-id="<?php echo $row['id']; ?>">
					<div class="hidden-util">
						<span class="hold">hold</span>
						<span class="dull">dull</span>
					</div>
					<div class="description"><?php echo $row['description'] ?></div>
					<div class="subtotal">$<?php echo $row['price']; ?></div>
				</div>
			<?php endwhile; ?>
		</div><!-- .descripions -->
	</div><!-- /.description-list0 /.fixed-price -->

<?php dbclose($result, $db); ?>
