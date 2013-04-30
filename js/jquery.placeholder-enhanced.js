/*!
 * jQuery Placeholder Enhanced 1.5
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {

  var pluginName = 'placeholderEnhanced',
    // if browser supports placeholder attribute, use native events to show/hide placeholder
    hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    // events namespaces
    event = {
      focus: 'focus.placeholder',
      blur: 'blur.placeholder',
      submit: 'submit.placeholder'
    },
    // placeholder css class
    placeholderCssClass = 'placeholder',
    $val;

  // if placeholder is not supported, the jQuery val function returns the placeholder
  // wrap the val function to fix this
  if (!hasNativeSupport) {
    $val = $.fn.val;
    $.fn.val = function () {
      var $el = this, el = $el[0];
      if (!el) {
        return;
      }
      if (!arguments.length && (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA')) {
        return el.value === $el.attr('placeholder') ? '' : el.value;

      } else {
        if ($el.hasClass(placeholderCssClass)) {
          $el.removeClass(placeholderCssClass);
        }
        return $val.apply($el, arguments);
      }
    };
  }

  $.fn[pluginName] = function () {

    // don't do anything with an empty collection
    if (!this.length) {
      return;
    }

    // ensure not sending placeholder value when placeholder is not supported
    if (!hasNativeSupport) {
      // filter forms to leave only the ones that submit event was not added yet
      $('form')
        // only grab forms that are not prepared
        .filter(function () {
          return !$.data(this, pluginName);
        })
        .each(function () {
          // bind submit event
          $(this).bind(event.submit, function () {
            // empty input value if it's the same as the placeholder attribute
            $(this).find('input[placeholder], textarea[placeholder]').each(function () {
              if (!$(this).val() && !this.disabled) {
                this.value = '';
              }
            });
          });
          // mark as prepared
          $.data(this, pluginName, true);
        });
    }

    // copy attributes from a DOM node to a plain object to use later
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
        $el = $(el),
        placeholderTxt = $el.attr('placeholder'),
        isPassword = (el.type === 'password'),
        fakePassw,
        setPlaceholder,
        removePlaceholder;

      // on blur set placeholder
      setPlaceholder = function () {
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
      };

      // on focus remove placeholder
      if (!isPassword || hasNativeSupport) {
        // for non-password inputs and textareas
        removePlaceholder = function () {
          if ($el.hasClass(placeholderCssClass)) {
            if (!hasNativeSupport) {
              el.value = '';
            }
            $el.removeClass(placeholderCssClass);
          }
        };

      // for password inputs
      } else if (!hasNativeSupport) {
        removePlaceholder = function () {
          showInput($el);
          hideInput(fakePassw);
        };

        // create a fake password input
        fakePassw = $('<input>', $.extend(copyAttrs(el), {
          'type': 'text',
          value: placeholderTxt,
          tabindex: -1 // skip tabbing
        }))
          // add placeholder class
          .addClass(placeholderCssClass)
          // when fake input has focus, trigger real input focus
          .bind(event.focus, function () {
            $el.trigger(event.focus);
          })
          // insert fake input
          .insertBefore($el);
      }

      // bind events and trigger blur the first time
      $el
        .bind(event.blur, setPlaceholder)
        .bind(event.focus, removePlaceholder)
        .trigger(event.blur);

      // mark plugin as initialized for current element
      $.data(el, pluginName, true);
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]')[pluginName]();
  });
}(jQuery));
