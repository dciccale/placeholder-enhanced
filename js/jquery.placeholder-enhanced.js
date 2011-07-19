/*! jQuery Placeholder Enhanced
* ----------------------------------------------------------
* Author: Denis Ciccale (dciccale@gmail.com)
* Password support by Gabriel Birke (gabriel.birke@gmail.com) & optimized by Denis Ciccale 
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/ 
(function ($) {
		
	$.fn.placeholderEnhanced = function() {
		
		var // placeholder css class
			c = "placeholder",
			// if browser supports placeholder attribute, use native events to show/hide placeholder
			hasNativeSupport = c in document.createElement("input");
			
		// ensure not sending placeholder value when placeholder is not supported
		if (!hasNativeSupport) {
			$('form').submit(function() {
				// form
				var $this = $(this);
				
				// empty input value if is the same as the placeholder attribute
				$this.find('input[placeholder], textarea[placeholder]').each(function () {
					var e = $(this);
					if (e.val() === e.attr('placeholder')) {
						e.val('');
					}
				});
			});
		}

		return this.each(function () {

			var e = $(this), d = e.attr("placeholder"), ispassword = e.attr('type') === "password";

			// on focus
			var placeholderOnFocus = function () {
				if(e.hasClass(c)) {
					if(!hasNativeSupport) {
						e.val('');
					}
					e.removeClass(c);
				}
			};

			// on blur
			var placeholderOnBlur = function (event, forceInit) {
				if(!e.val() || forceInit) {
					if(!hasNativeSupport) {
						if(!ispassword) {
							e.addClass(c).val(d);
						}
						else {
							showInput(pwdummy);
							hideInput(e);
						}
					}
					else {
						e.addClass(c)
					}
				}
			};

			// hides password input
			var hideInput = function(e) {
				e.css({position: 'absolute', left: '-9999em'});
			};

			// shows dummy text input
			var showInput = function(e) {
				return e.removeAttr('style');
			};

			// placeholder for text and textarea
			if(!ispassword || hasNativeSupport) {
				e.bind('focus.placeholder', placeholderOnFocus);
			}

			// placeholder for password
			else {
				var inputCssClass = (e[0].className) ? ' ' + e[0].className : '';
			
				// create input
				var pwdummy = $('<input type="text" class="' + c + inputCssClass + '" value="' + d + '" />');
				
				// insert the input before the password input so we can focus using tab key
				e.before(pwdummy);
				
				// Dummy text input focus event
				pwdummy.bind('focus.placeholder', function () {
					showInput(e).focus();
					hideInput(pwdummy);
				});
			}
			
			// bind blur event and trigger on load
			e.bind('blur.placeholder', placeholderOnBlur)
			.trigger('blur.placeholder', [true]);
		
		});
	
	};
	
	// init the plugin
	$(function () {
		var placeholderElements = $('input[placeholder], textarea[placeholder]');
		
		// if there are placeholder elements
		if(placeholderElements.length) {
			// init placeholder plugin
			placeholderElements.placeholderEnhanced();
		}
    });
})(jQuery);