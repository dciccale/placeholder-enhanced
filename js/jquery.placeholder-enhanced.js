/*!
 * jQuery Placeholder Enhanced 1.2
 * Copyright (c) 2012 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {

  // if browser supports placeholder attribute, use native events to show/hide placeholder
  var hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    $val;

  // if placeholder is not supported, the jQuery val function returns the placeholder
  // wrap the val function to fix this
  if (!hasNativeSupport) {
    $val = $.fn.val;
    $.fn.val = function () {
      if (!this.length) {
        return;
      }
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

    // copy attributes from a password input to a fakePassw
    function copyAttrs(element) {
      var attrs = {};
      $.each(element.attributes, function (i, attr) {
        if (attr.specified && attr.name !== 'placeholder' && attr.name !== 'name') {
          attrs[attr.name] = attr.value;
        }
      });
      return attrs;
    }

    // hides specified input
    function hideInput($input) {
      $input.css({position: 'absolute', left: '-9999em'});
    }

    // shows specified input
    function showInput($input) {
      $input.css({position: '', left: ''});
    }

    return this.each(function () {

      var el = this,
        $el = $(this),
        placeholderTxt = $el.attr('placeholder'),
        isPassword = (el.type === 'password'),
        fakePassw;

      // on focus
      function removePlaceholder() {
        if ($el.hasClass(placeholerCssClass)) {
          if (!hasNativeSupport) {
            $el.val('');
          }
          $el.removeClass(placeholerCssClass);
        }
      }

      // on blur
      function setPlaceholder() {
        // if there is no initial value
        // or initial value is equal to placeholder, init the placeholder
        if (!$el.val() || $el.val() === placeholderTxt) {
          if (!hasNativeSupport) {
            if (!isPassword) {
              $el.addClass(placeholerCssClass).val(placeholderTxt);
            } else {
              showInput(fakePassw);
              hideInput($el);
            }
          } else {
            $el.addClass(placeholerCssClass);
          }
        }
      }

      // placeholder for textarea and non-password inputs
      if (!isPassword || hasNativeSupport) {
        $el.bind('focus.placeholder', removePlaceholder);

      // placeholder for password
      } else {
        // create a fakePassw input
        // tabindex="-1" to skip tabbing
        fakePassw = $('<input>', $.extend(copyAttrs(el), {
          'type': 'text',
          value: placeholderTxt,
          tabindex: -1
        }))
          // add placeholder class
          .addClass(placeholerCssClass)
          // when fakePassw has focus, trigger password focus
          .bind('focus.placeholder', function () {
            $el.trigger('focus.placeholder');
          })
          // insert the fakePassw input
          .insertBefore($el);

        // when password input has focus, show the real password input and hide the fakePassw one
        $el.bind('focus.placeholder', function () {
          showInput($el);
          hideInput(fakePassw);
        });
      }

      // bind blur event and trigger it the first time
      $el.bind('blur.placeholder', setPlaceholder).trigger('blur.placeholder');
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });
}(jQuery));