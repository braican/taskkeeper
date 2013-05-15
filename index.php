<html>
<head>
	<title>TASKKEEPER</title>

	<link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="style.css">
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>

<div id="container">
	
	<h1>Projects</h1>
	<div class="project-list">
		<?php include("util/project-list.php"); ?>
	</div>

		<form action="util/add_project.php" method="post">
			<input type="text" name="new_project" maxlength="70" placeholder="add project"></input>
			<input type="text" name="rate" placeholder="$"></input>
			<input type="submit" value="Submit"></input>
		</form>

		<div class="success-text"></div>
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
	            $(".project-list").load("util/project-list.php");
	        }
	    });

			$('form input[type=text]').val('');
	});
</script>

</body>
</html>
