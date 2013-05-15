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
		$project = $_GET["val"];
		$proj_display = str_replace('_', ' ', $project);
		$proj_display = ucwords($proj_display);
	?>
	<h1><?php echo $proj_display ?></h1>
	<p>back to <a href="index.php" title="">project list</a></p>
	<div class="hours-list">
		<?php include("util/hours-list.php"); ?>
	</div>
	
	<form action="util/add_hours.php" method="post">
		<input type="text" name="description" placeholder="description"></input>
		<input type="text" name="hours" placeholder="number of hours"></input>
		<input type="hidden" name="project" value="<?php echo $project; ?>">
		<input type="submit" value="Submit"></input>
	</form>

	<div class="success-text"></div>

	<div class="hours_rate">
		
	</div>
	
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
		if($(this).hasClass('dulled')){
			$(this).css('opacity', '1').removeClass('dulled');
		} else {
			$(this).css('opacity', '0.2').addClass('dulled');
		}
	});
</script>

</body>
</html>
