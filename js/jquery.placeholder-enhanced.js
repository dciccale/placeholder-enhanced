/*!
 * jQuery Placeholder Enhanced 1.6.9
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under MIT license
 * https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt
 */

/* jshint jquery: true */
(function ($, doc) {

  var PLUGIN_NAME = 'placeholderEnhanced';

  // Check for support
  var HAS_NATIVE_SUPPORT = 'placeholder' in doc.createElement('input') &&
    'placeholder' in doc.createElement('textarea');

  // Event namespaces
  var EVENT = {
    FOCUS: 'focus.placeholder',
    BLUR: 'blur.placeholder'
  };

  /*
   * Define defaults here as some options are needed before initialization
   * it also merges with an options object when you call the plugin
   */
  var DEFAULTS = {
    cssClass: 'placeholder',

    /*
     * Normalize behaviour & style across browsers
     * (remove placeholder on focus, show on blur)
     * if false, each browser wil handle behaviour & style natively
     * i.e. in case of Chrome placeholder is still visible on focus
     */
    normalize: true
  };

  // Save original jQuery .val() function
  var $val = $.fn.val;

  // Checks if the node is valid to use with the fixed jQuery .val() function
  var isValidNode = function (el) {
    return ($.nodeName(el, 'input') || $.nodeName(el, 'textarea'));
  };

  // Copy attributes from a DOM node to a plain object to use later
  var copyAttrs = function (el) {
    var exclude = ['placeholder', 'name', 'id'];
    var attrs = {};
    var attr;

    for (var i = 0, l = el.attributes.length; i < l; i++) {
      attr = el.attributes[i];
      if (attr.specified && $.inArray(attr.name, exclude) < 0) {
        attrs[attr.name] = attr.value;
      }
    }

    return attrs;
  };

  // Shows specified password input
  var showInput = function ($input) {
    $input.css({position: '', left: ''});
  };

  // Hides specified password input
  var hideInput = function ($input) {
    $input.css({position: 'absolute', left: '-9999em'});
  };

  // Don't do anything if there is native placeholder support and normalize mode is off by default
  if (HAS_NATIVE_SUPPORT && !DEFAULTS.normalize) {
    return;
  }

  /*
   * Handle the use of jQuery .val(), if placeholder is not supported, the .val() function
   * returns the placeholder value, wrap the val function to fix this, also useful when
   * using .serialize() or any other jQuery method that uses .val()
   */

  // Fix .val() function for unsupported browsers
  if (!HAS_NATIVE_SUPPORT) {
    $.fn.val = function () {
      var args = arguments;
      var el = this[0];
      var placeholderTxt;

      if (!el) {
        return;
      }

      // Handle .val()
      if (!args.length) {
        placeholderTxt = $(el).attr('placeholder');

        // Handle get if the node has a placeholder
        if (placeholderTxt && isValidNode(el)) {
          return (el.value === placeholderTxt ? '' : el.value);

        // No placeholder, call native
        } else {
          return $val.apply(this, args);
        }
      }

      // Handle .val(...)
      return this.each(function (i, el) {
        var $el = $(el);
        var settings = $.data(el, PLUGIN_NAME);
        var placeholderTxt = $el.attr('placeholder');

        if (settings && placeholderTxt && isValidNode(el)) {

          // Handle .val(''), .val(null), .val(undefined)
          if (!args[0] && el.value !== placeholderTxt) {
            el.value = $el.addClass(settings.cssClass).attr('placeholder');

          // Handle .val('value')
          } else if (args[0]) {
            if ($el.hasClass(settings.cssClass)) {
              $el.removeClass(settings.cssClass);
            }
            $val.apply($el, args);
          }

        } else {
          $val.apply($el, args);
        }
      });
    };

  // Fix .val() function for modern browsers when normalize mode is on
  } else if (HAS_NATIVE_SUPPORT && DEFAULTS.normalize) {
    $.fn.val = function () {
      var args = arguments;
      var el = this[0];

      if (!el) {
        return;
      }

      // Handle .val()
      if (!args.length) {
        return $val.apply(this, args);
      }

      // Handle .val(...)
      return this.each(function (i, el) {
        var $el = $(el);
        var settings = $.data(el, PLUGIN_NAME);
        var placeholderTxt = el._placeholder;

        if (settings && placeholderTxt && isValidNode(el)) {

          // Handle .val(''), .val(null), .val(undefined)
          if (!args[0] && el.value !== placeholderTxt) {

            // Restore the placeholder
            $el.addClass(settings.cssClass).attr('placeholder', placeholderTxt);

          // Handle .val('value')
          } else if (args[0]) {
            if ($el.hasClass(settings.cssClass)) {
              $el.removeClass(settings.cssClass);
            }
          }
        }

        $val.apply($el, args);
      });
    };
  }

  // Placeholder Enhanced plugin
  $.fn[PLUGIN_NAME] = function (options) {

    // Merge passed options with defaults
    var settings = $.extend(DEFAULTS, options);

    // Don't do anything if empty set or if placeholder is supported but
    // don't want to normalize modern browsers
    if (!this.length || (HAS_NATIVE_SUPPORT && !settings.normalize)) {
      return;
    }

    // Check if options param is destroy method
    if (options === 'destroy') {

      // Completely destroy the plugin
      return this

        // Get the elements where the plugin was initialized
        .filter(function (i, el) {
          return $.data(el, PLUGIN_NAME);
        })

        // Remove class
        .removeClass(settings.cssClass)

        // Clean other stuff
        .each(function (i, el) {
          var $el = $(el).unbind('.placeholder');
          var isPassword = (el.type === 'password');
          var placeholderTxt = $el.attr('placeholder');

          // Do all this only for unsupported browsers
          if (!HAS_NATIVE_SUPPORT) {
            if (el.value === placeholderTxt) {
              el.value = '';
            }

            // Remove fake password input
            if (isPassword) {
              showInput($el);
              $el.prev().unbind('.placeholder').remove();
            }

          // Delete backup prop
          } else {
            delete el._placeholder;
          }

          // Restore original jQuery .val() function
          $.fn.val = $val;

          // Plugin off
          $.removeData(el, PLUGIN_NAME);
        });
    }

    return this.each(function (i, el) {

      // Check if the plugin was already initialized for this element
      if ($.data(el, PLUGIN_NAME)) {
        return;
      }

      // Mark plugin as initialized for the current element at the begining to
      // prevent multiple calls of the plugin for the same set of elements
      $.data(el, PLUGIN_NAME, settings);

      // jQuery object
      var $el = $(el);

      // Passwords have different treatment
      var isPassword = (el.type === 'password');

      // Current placeholder text
      var placeholderTxt = $el.attr('placeholder');

      // A fake input will be created for passwords
      var fakePassw = null;

      var setPlaceholder = null;
      var removePlaceholder = null;

      // Placeholder support for unsupported browsers
      if (!HAS_NATIVE_SUPPORT) {

        setPlaceholder = function () {

          // If there is no initial value or initial value is equal to the
          // placeholder (done in the $.fn.val wrapper) show the placeholder
          if (!$el.val()) {
            if (isPassword) {
              showInput(fakePassw);
              hideInput($el);
            } else {
              $el.val(placeholderTxt).addClass(settings.cssClass);
            }
          } else if ($el.val() && isPassword) {

            // If there is a value already, we want to remove the fake
            // placeholder. Otherwise, we'll have both the fake placeholder
            // and the actual input visible
            removePlaceholder();
          }
        };

        // Remove function for inputs and textareas
        if (!isPassword) {

          removePlaceholder = function () {
            if ($el.hasClass(settings.cssClass)) {
              el.value = '';
              $el.removeClass(settings.cssClass);
            }
          };

        // And for password inputs
        } else {

          removePlaceholder = function () {
            showInput($el);
            hideInput(fakePassw);
          };

          // Create a fake password input
          fakePassw = $('<input>', $.extend(copyAttrs(el), {
              'type': 'text',
              value: placeholderTxt,
              tabindex: -1 // Skip tabbing
            }))
            .addClass(settings.cssClass)

            // When focus, trigger real input focus
            .bind(EVENT.FOCUS, function () {
              $el.trigger(EVENT.FOCUS);
            })

            // Insert the fake input
            .insertBefore($el);
        }

      // Normalize placeholder behaviour and style in modern browsers if normalize mode is on
      } else if (HAS_NATIVE_SUPPORT && settings.normalize) {

        // Save the placeholder to restore it when needed
        el._placeholder = $el.attr('placeholder');

        setPlaceholder = function () {
          if (!el.value) {
            $el.addClass(settings.cssClass).attr('placeholder', placeholderTxt);
          }
        };

        removePlaceholder = function () {
          $el.removeAttr('placeholder').removeClass(settings.cssClass);
        };

      }

      // Bind events and trigger blur the first time
      $el
        .bind(EVENT.BLUR, setPlaceholder)
        .bind(EVENT.FOCUS, removePlaceholder)
        .trigger(EVENT.BLUR);
    });
  };

  // Auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]')[PLUGIN_NAME]();
  });

}(jQuery, document));
