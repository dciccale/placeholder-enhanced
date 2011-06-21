/* jQuery Placeholder Enhanced
* ----------------------------------------------------------
* Author: Denis Ciccale (dciccale@gmail.com)
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/ 
(function ($) {
		// native support flag
	var hasNativeSupport = false,
		// placeholder css class
		c = "placeholder";
	
	// if browser supports placeholder attribute, use native events to show/hide placeholder
	if ("placeholder" in document.createElement("input")) {
		hasNativeSupport = true;
	}
	
	// init the plugin
    $(function () {
        var placeholderElements = $("input:text[placeholder], textarea[placeholder]");
        
        // if there are no placeholders return
        if(!placeholderElements.length) return;
        
        // init placeholder event
        placeholderElements.each(placeholderEvent);
        
        // ensure not posting placeholder value when placeholder is not native
        if (!hasNativeSupport) {
        	$("form").submit(onSubmit);
        }
    });

    function placeholderEvent() {
		var e = $(this),
        	d = e.attr("placeholder");
        
        // attach events
        e.bind("focus.placeholder", function () {
        	if(!hasNativeSupport) {
	            if (e.val() === d) {
	            	e.val("");
	                e.removeClass(c);
	            }
        	}
        	else {
        		e.removeClass(c);
        	}
        })
    	.bind("blur.placeholder", function () {
        	if(!hasNativeSupport) {
	            if (e.val() === "" || e.val() === d) {
	        		e.val(d);
	        		e.addClass(c);
	            }
        	}
        	else if (!e.val()){
        		e.addClass(c);
        	}
        }).trigger("blur.placeholder");
    }
    
	// only for browser that don't support placeholder
	// empty input value if is the same as the placeholder attribute
    function onSubmit() {
		var $this = $(this);
		
		$this.find("input:text[placeholder], textarea[placeholder]").each(function () {
            var e = $(this);
            if (e.val() === e.attr("placeholder")) {
                e.val("");
            }
        });
    }
})(jQuery);