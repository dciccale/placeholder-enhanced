/*!
 * jQuery Placeholder Enhanced 1.1
 * Copyright (c) 2012 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {

  // if browser supports placeholder attribute, use native events to show/hide placeholder
  var hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    $val;

  // if placeholder is not supported, the jQuery val function returns the placeholder
  // redefine the val function to fix this
  if (!hasNativeSupport) {
    $val = $.fn.val;
    $.fn.val = function () {
      if (!arguments.length && (this[0].nodeName === 'INPUT' || this[0].nodeName === 'TEXTAREA')) {
        return this.attr('value') === this.attr('placeholder') ? '' : this.attr('value');
      }
      return $val.apply(this, arguments);
    };
  }

  $.fn.placeholderEnhanced = function () {

    // don't act on absent elements
    if (!this.length) {
      return;
    }

    // placeholder css class
    var placeholerCssClass = 'placeholder';

    // ensure not sending placeholder value when placeholder is not supported
    if (!hasNativeSupport) {
      $('form').submit(function () {
        // empty input value if is the same as the placeholder attribute
        $(this).find('input[placeholder], textarea[placeholder]').each(function () {
          if (this.value === this.placeholder) {
            this.value = '';
          }
        });
      });
    }

    return this.each(function () {

      var el = this,
        $el = $(this),
        d = $el.attr('placeholder'),
        isPassword = $el.attr('type') === 'password',
        fakePassw, inputCssClass, size;

      // hides password input
      function hideInput($el) {
        $el.css({position: 'absolute', left: '-9999em'});
      }

      // shows dummy text input
      function showInput($el) {
        $el.css({position: '', left: ''});
      }

      // on focus
      function placeholderOnFocus() {
        if ($el.hasClass(placeholerCssClass)) {
          if (!hasNativeSupport) {
            $el.val('');
          }
          $el.removeClass(placeholerCssClass);
        }
      }

      // on blur
      function placeholderOnBlur(event) {
        // if there is no initial value
        // or initial value is equal to placeholder, init the placeholder
        if (!$el.val() || $el.val() === d) {
          if (!hasNativeSupport) {
            if (!isPassword) {
              $el.addClass(placeholerCssClass).val(d);
            } else {
              showInput(fakePassw);
              hideInput($el);
            }
          } else {
            $el.addClass(placeholerCssClass);
          }
        }
      }

      // placeholder for text and textarea
      if (!isPassword || hasNativeSupport) {
        $el.bind('focus.placeholder', placeholderOnFocus);
      } else { // placeholder for password
        // get class from the original input if any (to keep any styling)
        inputCssClass = (el.className) ? ' ' + el.className : '';
        // get size attr also
        size = (el.size) ? 'size=' + el.size : '';

        // create input with tabindex="-1" to skip tabbing
        fakePassw = $('<input type="text" class="' + placeholerCssClass + inputCssClass + '" value="' + d + '"' + size + ' tabindex="-1" />');

        // trigger password focus when focus is on text input
        fakePassw.bind('focus.placeholder', function () {
          $el.trigger('focus.placeholder');
        });

        // insert the text input
        $el.before(fakePassw)
          // focus event to show the real password input
          .bind('focus.placeholder', function () {
            showInput($el);
            hideInput(fakePassw);
          });
      }

      // bind blur event and trigger on load
      $el
        .bind('blur.placeholder', placeholderOnBlur)
        .trigger('blur.placeholder');
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });
}(jQuery));