/* jQuery Placeholder Enhanced
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
	
		// don't act on absent elements
		if(!this.length) return;
		
		var // placeholder css class (if you change the class name, be sure to change the c below to "placeholder")
			c = "placeholder",
			// if browser supports placeholder attribute, use native events to show/hide placeholder
			hasNativeSupport = c in document.createElement("input");
			
			
			// extra check for Opera: Opera 11 supports placeholder only for input, and you cannot style it yet, even with a class you can't.
			// http://my.opera.com/ODIN/blog/2010/12/17/new-html5-features-in-opera-11
			// http://dev.opera.com/forums/topic/841252?t=1296553904&page=1#comment8072202
			// this is fixed for version 11.50
			if($.browser.opera && $.browser.version < '11.50') hasNativeSupport = false;
			
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
			var placeholderOnBlur = function (event) {
				// if there is no initial value
				// or initial value is equal to placeholder, init the placeholder
				if(!e.val() || e.val() === d) {
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
			.trigger('blur.placeholder');
		
		});
	};
	
	// auto-initialize the plugin
	$(function () {
		$('input[placeholder], textarea[placeholder]').placeholderEnhanced();
    });
	
	// if placeholder is not supported, the jQuery val function returns the placeholder
	// redefine the val function to fix this
	var hasNativeSupport = "placeholder" in document.createElement("input");
	if($.browser.opera && $.browser.version < '11.50') hasNativeSupport = false;
	if(!hasNativeSupport) {
		var jQval = $.fn.val;
		$.fn.val = function (value) {
			if (!arguments.length) {
				return $(this).attr("value") === $(this).attr("placeholder") ? "" : $(this).attr("value");
			}
			return jQval.call(this, value);
		};
	}
})(jQuery);