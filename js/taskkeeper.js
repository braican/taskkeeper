
$(function(){

	// get paid button
	$('.get-paid').on('click', function(e){
		e.preventDefault();
		var proj = $(this).attr('data-project');
		$.ajax({
			type	: "POST",
			cache	: false,
			url		: 'util/payed_switch.php',
			data	: 'project=' + proj,
			success : function(data){
				$(".hours-list").load("util/hours-list.php?val=" + proj);
			}
		});
	});

	// when a row is clicked, dull it out a bit
	$('tr').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('dulled');
	});

	// -------------------------------
	// forms
	//

	// add project form
	$('#add-project').on('submit', function(e){
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

		$('input[type=text]').val('');
	});

	// add hours form
	$('#add-hours').on('submit', function(e){
	    e.preventDefault();
	    var proj = $(this).find('input[name=project]').attr('value');
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
	            $(".hours-list").load("util/hours-list.php?val=" + proj);

	            $('input[type=text]').val('');
	        }
	    });
	});
});