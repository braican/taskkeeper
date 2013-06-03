<html>
<head>
	<title>TASKKEEPER | Add</title>

	<link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="style.css">
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
<div id="container">
	<?php
		require_once("util/db_util.php");
		$db = dbconnect();
		$db_name = $_GET['val'];
		$sql = "SELECT `name` FROM `projects` WHERE `project` = '" . $db_name . "'";
		if(!$result = $db->query($sql)){
			die('There was an error running the query [' . $db->error . ']');
		}

		while($row = $result->fetch_assoc()){
			$name = $row['name'];
	?>
	
	<h1><?php echo $name ?></h1>

	<?php
		}
		
		dbclose($result, $db);
	?>
	
	<p>back to <a href="index.php" title="">project list</a></p>
	<div class="hours-list">
		<?php include("util/hours-list.php"); ?>
	</div>
	
	<form action="util/add_hours.php" method="post" class="addhours-form">
		
		<input type="text" name="description" placeholder="description"></input>
		<input type="text" name="hours" placeholder="number of hours"></input>
		<input type="hidden" name="project" value="<?php echo $project; ?>">
		<input type="submit" value="Submit"></input>
	</form>

	<div class="success-text"></div>
	
	<div id="get_paid">GET PAID!</div>
	<div class="success-payed-text"></div>

</div>
<script type="text/javascript">

	$('form').on('submit', function(e){
	    e.preventDefault();
	    $.ajax({
	        type     : "POST",
	        cache    : false,
	        url      : $(this).attr('action'),
	        data	 : $(this).serialize(),
	        success  : function(data) {
	        	console.log(data);

	            $(".success-text").empty().html(data).animate({opacity:1});
	            setTimeout(function(){
	            	$(".success-text").animate({opacity:0});
	            }, 5000);
	            $(".hours-list").load("util/hours-list.php?val=<?php echo $project ?>");

	            $('input').val('');
	        }
	    });
	});

	$('#get_paid').on('click', function(e){
		e.preventDefault();
		$.ajax({
			type	: "POST",
			cache	: false,
			url		: 'util/payed_switch.php',
			data	: 'project=<?php echo $project ?>',
			success : function(data){
				console.log(data);
				$(".success-payed-text").empty().html("PAYED").animate({opacity:1});
				$(".hours-list").load("util/hours-list.php?val=<?php echo $project ?>");
			}
		});
	});

	$('tr').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('dulled');
	});
</script>

</body>
</html>
