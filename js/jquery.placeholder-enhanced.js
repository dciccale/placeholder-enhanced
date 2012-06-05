/* jQuery Placeholder Enhanced
*
* by Denis Ciccale (@tdecs)
* Password support by Gabriel Birke (gabriel.birke@gmail.com)
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/
(function ($) {

  $.fn.placeholderEnhanced = function () {

    // don't act on absent elements
    if (!this.length) {
      return;
    }

    var // placeholder css class (if you change the class name, be sure to change the c below to "placeholder")
      c = "placeholder",
      // if browser supports placeholder attribute, use native events to show/hide placeholder
      hasNativeSupport = c in document.createElement("input") && c in document.createElement("textarea");

    // ensure not sending placeholder value when placeholder is not supported
    if (!hasNativeSupport) {
      $('form').submit(function () {
        // form
        var $this = $(this);

        // empty input value if is the same as the placeholder attribute
        $this.find('input[placeholder], textarea[placeholder]').each(function () {
          var e = $(this);
          if (e.attr('value') === e.attr('placeholder')) {
            e.val('');
          }
        });
      });
    }

    return this.each(function () {

      var e = $(this), d = e.attr("placeholder"), ispassword = e.attr('type') === "password",
        fakePassw, inputCssClass, size;

      // hides password input
      function hideInput(e) {
        e.css({position: 'absolute', left: '-9999em'});
      }

      // shows dummy text input
      function showInput(e) {
        e.css({position: '', left: ''});
      }

      // on focus
      function placeholderOnFocus() {
        if (e.hasClass(c)) {
          if (!hasNativeSupport) {
            e.val('');
          }
          e.removeClass(c);
        }
      }

      // on blur
      function placeholderOnBlur(event) {
        // if there is no initial value
        // or initial value is equal to placeholder, init the placeholder
        if (!e.val() || e.val() === d) {
          if (!hasNativeSupport) {
            if (!ispassword) {
              e.addClass(c).val(d);
            } else {
              showInput(fakePassw);
              hideInput(e);
            }
          } else {
            e.addClass(c);
          }
        }
      }

      // placeholder for text and textarea
      if (!ispassword || hasNativeSupport) {
        e.bind('focus.placeholder', placeholderOnFocus);
      } else { // placeholder for password
        // get class from the original input if any (to keep any styling)
        inputCssClass = (e[0].className) ? ' ' + e[0].className : '';
        // get size attr also
        size = (e[0].size) ? 'size=' + e[0].size : '';

        // create input with tabindex="-1" to skip tabbing
        fakePassw = $('<input type="text" class="' + c + inputCssClass + '" value="' + d + '"' + size + ' tabindex="-1" />');

        // trigger password focus when focus is on text input
        fakePassw.bind('focus.placeholder', function () {
          e.trigger('focus.placeholder');
        });

        // insert the text input
        e.before(fakePassw)
          // focus event to show the real password input
          .bind('focus.placeholder', function () {
            showInput(e);
            hideInput(fakePassw);
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
  var hasNativeSupport = "placeholder" in document.createElement("input") && "placeholder" in document.createElement("textarea"),
    $val;

  if (!hasNativeSupport) {
    $val = $.fn.val;
    $.fn.val = function () {
      if (!arguments.length && (this[0].nodeName === 'INPUT' || this[0].nodeName === 'TEXTAREA')) {
        return this.attr("value") === this.attr("placeholder") ? "" : this.attr("value");
      }
      return $val.apply(this, arguments);
    };
  }
}(jQuery));
