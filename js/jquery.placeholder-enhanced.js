/*!
 * jQuery Placeholder Enhanced 1.4
 * Copyright (c) 2012 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {

  var pluginName = 'placeholderEnhanced',
    // if browser supports placeholder attribute, use native events to show/hide placeholder
    hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    events = {
      focus: 'focus.placeholder',
      blur: 'blur.placeholder'
    },
    // placeholder css class
    placeholderCssClass = 'placeholder',
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
        return this[0].value === this.attr('placeholder') ? '' : this[0].value;

      } else {
        if (this.hasClass(placeholderCssClass)) {
          this.removeClass(placeholderCssClass);
        }
        return $val.apply(this, arguments);
      }
    };
  }

  $.fn[pluginName] = function () {

    // don't act on absent elements
    if (!this.length) {
      return;
    }

    // ensure not sending placeholder value when placeholder is not supported
    if (!hasNativeSupport) {
      // filter forms to leave only the ones that submit event was not added yet
      $('form')
        .filter(function () {
          return !$.data(this, pluginName);
        })
        // bind submit event
        .each(function () {
          $(this).bind('submit.placeholder', function () {
            // empty input value if is the same as the placeholder attribute
            $(this).find('input[placeholder], textarea[placeholder]').each(function () {
              if (!$(this).val() && !this.disabled) {
                this.value = '';
              }
            });
          });
          // mark it to know this already have submit event
          $.data(this, pluginName, true);
        });
    }

    // copy attributes from a password input to a fakePassw
    function copyAttrs(element) {
      var attrs = {}, exclude = ['placeholder', 'name', 'id'];
      $.each(element.attributes, function (i, attr) {
        if (attr.specified && $.inArray(attr.name, exclude) < 0) {
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

      // check if plugin already initialized
      if ($.data(this, pluginName)) {
        return;
      }

      var el = this,
        $el = $(this),
        placeholderTxt = $el.attr('placeholder'),
        isPassword = (el.type === 'password'),
        fakePassw;

      // on focus
      function removePlaceholder() {
        if ($el.hasClass(placeholderCssClass)) {
          if (!hasNativeSupport) {
            el.value = '';
          }
          $el.removeClass(placeholderCssClass);
        }
      }

      // on blur
      function setPlaceholder() {
        // if there is no initial value
        // or initial value is equal to placeholder (done in the fn.val wrapper)
        // init the placeholder
        if (!$el.val()) {
          if (!hasNativeSupport) {
            if (!isPassword) {
              $el.val(placeholderTxt).addClass(placeholderCssClass);
            } else {
              showInput(fakePassw);
              hideInput($el);
            }
          } else {
            $el.addClass(placeholderCssClass);
          }
        }
      }

      // placeholder for textarea and non-password inputs
      if (!isPassword || hasNativeSupport) {
        $el.bind(events.focus, removePlaceholder);

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
          .addClass(placeholderCssClass)
          // when fakePassw has focus, trigger password focus
          .bind(events.focus, function () {
            $el.trigger(events.focus);
          })
          // insert the fakePassw input
          .insertBefore($el);

        // when password input has focus, show the real password input and hide the fakePassw one
        $el.bind(events.focus, function () {
          showInput($el);
          hideInput(fakePassw);
        });
      }

      // bind blur event and trigger it the first time
      $el.bind(events.blur, setPlaceholder).trigger(events.blur);

      // mark plugin as initialized
      $.data(el, pluginName, true);
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });
}(jQuery));