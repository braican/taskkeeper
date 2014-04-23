
<?php include('includes/header.html'); ?>
	
	<h1>Clients</h1>
	<div class="project-list">
		<?php include("util/project-list.php"); ?>
	</div><!-- .project-list -->

	<form action="util/add_project.php" method="post" id="add-project">
		<input type="text" name="new_project" maxlength="70" placeholder="add client"></input>
		<input type="text" name="rate" placeholder="$" size="5"></input>
		<input type="submit" value="Submit"></input>
	</form>

	<div class="success-text"></div>

<?php include('includes/footer.html'); ?>
