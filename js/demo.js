$(function() {
	var result = $('#result'),
		form = $('#form');
		
	form.submit(function(e) {
		e.preventDefault();
		result.html(form.serialize());
		
		// just for the demo, reestablish placeholder for no native placeholder support browsers
		$("input:text[placeholder], textarea[placeholder]").trigger("blur.placeholder");
	});
});