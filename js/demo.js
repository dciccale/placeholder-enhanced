$(function() {
	var result = $('#result'),
		form = $('#form');
		
	form.submit(function(e) {
		e.preventDefault();
		result.html(form.serialize());
	});
});