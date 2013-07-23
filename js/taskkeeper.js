
$(function(){

	// get paid button
	$('.get-paid').on('click', function(e){
		e.preventDefault();
		$('.waiting-on-invoice, .get-paid').addClass('hide');
		$('.outbound-invoice').removeClass('hide');
		var project = $(this).attr('data-project'),
			ids = [];

		$('.description-list .row.hold-row').each(function(i, e) {
			var id = $(e).attr('data-id');
			ids.push(id);
		});

		$.ajax({
			type	: "POST",
			cache	: false,
			url		: 'util/payed_switch.php?get-paid',
			data	: 'project=' + project + '&hold=' + ids,
			success : function(data){
				$(".hours-list").load("util/hours-list.php?val=" + project);
				console.log(data);
			}
		});
	});

	// waiting on invoice button
	$('.outbound-invoice').on('click', function(event) {
		event.preventDefault();
		var project = $(this).attr('data-project');
		$('.waiting-on-invoice, .get-paid').removeClass('hide');
		$('.outbound-invoice').addClass('hide');
		$.ajax({
			type	: "POST",
			cache	: false,
			url		: 'util/payed_switch.php',
			data 	: 'project=' + project,
			success : function(data){
				$(".hours-list").load("util/hours-list.php?val=" + project);
				console.log(data);
			}
		})
	});

	// when a row is clicked, show the description util
	$(document).on('click', '.descriptions .row .description', function(e){
		e.preventDefault();
		var width = $(this).parent().find('.hidden-util').width() + 20;

		if($(this).parent().hasClass('show-hidden-util')){
			$(this).parent().removeClass('show-hidden-util').find('.hidden-util').animate({
				'left' : '-50px',
				'opacity': '0'
			});	
		} else {
			$(this).parent().addClass('show-hidden-util').find('.hidden-util').animate({
				'left' : '-' + width + 'px',
				'opacity': '1'
			});	
		}
	});



	// the hidden utility
	$(document).on('click', '.hidden-util span', function(event) {
		event.preventDefault();
		if($(this).hasClass('hold')){
			$(this).removeClass('hold').addClass('unhold').text('unhold').parents('.row').addClass('hold-row');
			var due = $('.total-due').text(),
				thisAmt = $(this).parent().siblings('.subtotal').text();
			dueInt = stripAndInt(due);
			thisAmtInt = stripAndInt(thisAmt);
			var newDue = dueInt - thisAmtInt
			$('.total-due').text('$' + newDue);
		} else if($(this).hasClass('unhold')){
			$(this).removeClass('unhold').addClass('hold').text('hold').parents('.row').removeClass('hold-row');
			var due = $('.total-due').text(),
				thisAmt = $(this).parent().siblings('.subtotal').text();
			dueInt = stripAndInt(due);
			thisAmtInt = stripAndInt(thisAmt);
			var newDue = dueInt + thisAmtInt
			$('.total-due').text('$' + newDue);
		} else if($(this).hasClass('dull')){
			$(this).removeClass('dull').addClass('undull').text('un-dull').parents('.row').addClass('dulled');
		} else if($(this).hasClass('undull')){
			$(this).removeClass('undull').addClass('dull').text('dull').parents('.row').removeClass('dulled');
		}
	});


	// -------------------------------
	// project utilities
	//

	// cancel
	$(document).on('click', '.cancel', function(e){
		e.preventDefault();
		$('.overlay').remove();
	});

	// rename project
	$(document).on('click', '.rename', function(e){
		e.preventDefault();
		var project = $(this).parents('.project').attr('id');
		var name = $(this).parents('.project').find('a').text();
		var overlay = 	'<div class="overlay">' + 
							'<div class="overlay-container">' +
								'<form id="rename-project">' +
									'<h3>Rename project ' + name + '</h3>' +
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

	// delete project
	$(document).on('click', '.delete', function(e){
		e.preventDefault();
		var project = $(this).parents('.project').attr('id');
		var name = $(this).parents('.project').find('a').text();
		var overlay = 	'<div class="overlay">' + 
							'<div class="overlay-container">' +
								'<form id="delete-project">' +
									'<h3>You sure you want to delete project ' + name + '?</h3>' +
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


	// update hours on project
	$(document).on('click', '.descriptions .row .num-hours', function(event) {
		event.preventDefault();
		var project = $('h1.page-title').attr('id'),
			id = $(this).parent().attr('data-id');
		var overlay = 	'<div class="overlay">' + 
							'<div class="overlay-container">' +
								'<form id="update-hours">' +
									'<h3>Update Hours</h3>' +
									'<input type="text" id="new_hours" name="new_hours">' +
									'<input type="hidden" name="project_name" value="' + project + '">' +
									'<input type="hidden" name="description_id" value="' + id + '">' +
									'<input type="submit" value="Go">' +
									'<div class="cancel">Cancel</div>' +
								'</form>' +
							'</div>' + 
						'</div>';
		$('body').append(overlay);
	});
	$(document).on('submit', '#update-hours', function(e){
		e.preventDefault();
		var project = $(this).find('input[name=project_name]').val();
		$.ajax({
			type	: "POST",
			url		: 'util/update-hours.php',
			data 	: $(this).serialize(),
			success : function(data){
				if(data != 0){
					console.log(data);
					$('.overlay-container').append('<p>something went wrong</p>');
				} else {
					$('.overlay').remove();
					$(".hours-list").load("util/hours-list.php?val=" + project);
				}
			}
		});
	})

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

// strips out whitespace and dollar signs, and returns an int
function stripAndInt(string){
	string = string.replace(/ /g, '').replace(/\$/g, '');
	newInt = parseInt(string);
	return newInt;
}