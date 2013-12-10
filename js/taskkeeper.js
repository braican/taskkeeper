
// ----------
// namespace - TASKKEEPER
//
(function(TASKKEEPER, $, undefined){
	
	//
	// PRIVATE

	//
	// strips out whitespace and dollar signs, and returns an int
	//
	function stripAndInt(string){
		string = string.replace(/ /g, '').replace(/\$/g, '');
		newInt = parseInt(string);
		return newInt;
	}


	// 
	// PUBLIC
	//
	TASKKEEPER.init = function(){

		// -------------------------------
		// forms
		// -------------------------------

		//
		// add project form
		//
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

		//
		// add hours form
		//
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

		// -------------------------------
		// project utilities on homepage
		// -------------------------------

		// cancel
		$(document).on('click', '.cancel', function(e){
			e.preventDefault();
			$('.overlay').remove();
		});

		// rename project
		$(document).on('click', '.rename', function(e){
			e.preventDefault();
			var project = $(this).parents('.project').attr('id'),
				name = $(this).parents('.project').find('a').text(),
				overlay = 	'<div class="overlay">' + 
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
			var project = $(this).parents('.project').attr('id'),
				name = $(this).parents('.project').find('a').text(),
				overlay = 	'<div class="overlay">' + 
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
				id = $(this).parent().attr('data-id'),
				overlay = 	'<div class="overlay">' + 
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
		});

		// -------------------------------
		// the hours listing page
		// -------------------------------

		//
		// get paid button
		//
		$('.get-paid').on('click', function(e){
			e.preventDefault();
			var project = $(this).attr('data-project'),
				ids = [];

			$('.waiting-on-invoice, .get-paid').addClass('hide');
			$('.outbound-invoice').removeClass('hide');

			$('.description-list .row.hold-row').each(function(i, e) {
				ids.push($(e).attr('data-id'));
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

		//
		// waiting on invoice button
		//
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

		//
		// show/hide the row utility menu
		//
		$(document).on('click', '.descriptions .row .description', function(e){
			e.preventDefault();
			var $p = $(this).parent(),
				width = $p.find('.hidden-util').width() + 20;

			if($p.hasClass('show-hidden-util')){
				$p.removeClass('show-hidden-util');
			} else {
				$p.addClass('show-hidden-util');
			}
		});

		//
		// the hidden utility switch
		//
		$(document).on('click', '.hidden-util span', function(event) {
			event.preventDefault();

			var $t = $(this),
				id = $t.parents('.row').attr('data-id'),
				project = $('.page-title').attr('id'),
				newDue;
			
			if($t.hasClass('hold')){
				var due = $('.total-due').text(),
					thisAmt = $(this).parent().siblings('.subtotal').text();
				
				$t.removeClass('hold').addClass('unhold').text('unhold').parents('.row').addClass('hold-row');
				
				dueInt = stripAndInt(due);
				thisAmtInt = stripAndInt(thisAmt);
				newDue = dueInt - thisAmtInt;
				$('.total-due').text('$' + newDue);
			} else if($t.hasClass('unhold')){
				var due = $('.total-due').text(),
					thisAmt = $t.parent().siblings('.subtotal').text();
				
				$t.removeClass('unhold').addClass('hold').text('hold').parents('.row').removeClass('hold-row');
				
				dueInt = stripAndInt(due);
				thisAmtInt = stripAndInt(thisAmt);
				newDue = dueInt + thisAmtInt
				
				$('.total-due').text('$' + newDue);
			} else if($t.hasClass('dull')){
				$t.removeClass('dull').addClass('undull').text('un-dull').parents('.row').addClass('dulled');
			} else if($t.hasClass('undull')){
				$t.removeClass('undull').addClass('dull').text('dull').parents('.row').removeClass('dulled');
			} else if($t.hasClass('delete-row')){
				$('.hours-list').load('util/hours-list.php?deleterow=' + id + '&val=' + project);
			}
		});

	};

	$(document).ready(function(){
		TASKKEEPER.init();
	});

}(window.TASKKEEPER = window.TASKKEEPER || {}, jQuery));
