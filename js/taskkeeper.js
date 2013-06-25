
$(function(){

	// get paid button
	$('.get-paid').on('click', function(e){
		e.preventDefault();
		var project = $(this).attr('data-project');
		$.ajax({
			type	: "POST",
			cache	: false,
			url		: 'util/payed_switch.php',
			data	: 'project=' + proj,
			success : function(data){
				$(".hours-list").load("util/hours-list.php?val=" + project);
			}
		});
	});

	// when a row is clicked, dull it out a bit
	$('tr').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('dulled');
	});

	// -------------------------------
	// project utility
	//

	// cancel
	$(document).on('click', '.cancel', function(e){
		e.preventDefault();
		$('.overlay').remove();
	});

	// rename
	$(document).on('click', '.rename', function(e){
		e.preventDefault();
		var project = $(this).parents('.project').attr('id');
		var name = $(this).parents('.project').find('a').text();
		var overlay = 	'<div class="overlay">' + 
							'<div class="overlay-container">' +
								'<form id="rename-project">' +
									'<p>Rename project ' + name + '</p>' +
									'<input type="text" id="new_name" name="new_name">' +
									'<input type="hidden" name="old_name" value="' + project + '">' +
									'<input type="submit" value="Go">' +
									'<div class="cancel">Cancel</div>' +
								'</form>' +
							'</div>' + 
						'</div>';
		$('body').append(overlay);
	});
	$(document).on('submit', '#rename-project', function(e){
		e.preventDefault();
		$.ajax({
			type	: "POST",
			url		: 'util/rename-project.php',
			data 	: $(this).serialize(),
			success : function(data){
				console.log(data);
				if(data == 1){
					$('.overlay-container').append('<p>Gotta add a name</p>');
				} else{
					$('.overlay').remove();
					$(".project-list").load("util/project-list.php");
				}
			}
		});
	});

	// delete
	$(document).on('click', '.delete', function(e){
		e.preventDefault();
		var project = $(this).parents('.project').attr('id');
		var name = $(this).parents('.project').find('a').text();
		var overlay = 	'<div class="overlay">' + 
							'<div class="overlay-container">' +
								'<form id="delete-project">' +
									'<p>You sure you want to delete project ' + name + '?</p>' +
									'<input type="hidden" name="old_name" value="' + project + '">' +
									'<input type="submit" value="DELETE">' +
									'<div class="cancel">NEVERMIND</div>' +
								'</form>' +
							'</div>' + 
						'</div>';
		$('body').append(overlay);
	});
	$(document).on('submit', '#delete-project', function(e){
		e.preventDefault();
		$.ajax({
			type	: "POST",
			url		: 'util/delete-project.php',
			data 	: $(this).serialize(),
			success : function(data){
				if(data != 0){
					console.log(data);
					$('.overlay-container').append('<p>something went wrong</p>');
				} else {
					$('.overlay').remove();
					$(".project-list").load("util/project-list.php");	
				}
			}
		});
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
	    var project = $(this).find('input[name=project]').attr('value');
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
	            $(".hours-list").load("util/hours-list.php?val=" + project);

	            $('input[type=text]').val('');
	        }
	    });
	});
});