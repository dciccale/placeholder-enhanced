/*!
 * jQuery Placeholder Enhanced 1.6.8
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under MIT license
 * https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt
 */

/* jshint jquery: true */
(function ($, doc) {

  var PLUGIN_NAME = 'placeholderEnhanced';

  // check for support
  var HAS_NATIVE_SUPPORT = 'placeholder' in doc.createElement('input') &&
    'placeholder' in doc.createElement('textarea');

  // event namespaces
  var EVENT = {
    FOCUS: 'focus.placeholder',
    BLUR: 'blur.placeholder'
  };

  /*
   * define defaults here as some options are needed before initialization
   * it also merges with an options object when you call the plugin
   */
  var DEFAULTS = {
    cssClass: 'placeholder',

    /*
     * normalize behaviour & style across browsers
     * (remove placeholder on focus, show on blur)
     * if false, each browser wil handle behaviour & style natively
     * i.e. in case of Chrome placeholder is still visible on focus
     */
    normalize: true
  };

  // save original jQuery .val() function
  var $val = $.fn.val;

  // don't do anything if there is native placeholder support but normalize mode is off by default
  if (HAS_NATIVE_SUPPORT && !DEFAULTS.normalize) {
    return;
  }

  /*
   * handle the use of jQuery .val(), if placeholder is not supported, the .val() function
   * returns the placeholder value, wrap the val function to fix this, also useful when
   * using .serialize() or any other jQuery method that uses .val()
   */

  // fix .val() function for unsupported browsers
  if (!HAS_NATIVE_SUPPORT) {
    $.fn.val = function () {
      var args = arguments;
      var el = this[0];

      if (!el) {
        return;
      }

      // handle .val()
      if (!args.length) {
        if (this.attr('placeholder') && ($.nodeName(el, 'input') || $.nodeName(el, 'textarea'))) {
          return el.value === this.attr('placeholder') ? '' : el.value;
        } else {
          return $val.apply(this, arguments);
        }
      }

      // handle .val(...)
      return this.each(function () {
        var el = this;
        var $el = $(el);
        var settings = $.data(el, PLUGIN_NAME);
        var isValidNode = ($.nodeName(el, 'input') || $.nodeName(el, 'textarea'));
        var hasPlaceholderAttr = $el.attr('placeholder');

        // only fix jQuery val function for input and textarea elements that has a placeholder
        if (isValidNode && hasPlaceholderAttr) {

          // handle .val(''), .val(null), .val(undefined)
          if (!args[0]) {
            el.value = $el.addClass(settings.cssClass).attr('placeholder');

          // handle .val('value')
          } else {
            $el.removeClass(settings.cssClass);
            $val.apply($el, args);
          }

        // anything else call native jQuery's .val()
        } else {
          $val.apply($el, args);
        }
      });
    };

  // fix .val() function for modern browsers when normalize mode is on
  } else if (HAS_NATIVE_SUPPORT && DEFAULTS.normalize) {
    $.fn.val = function () {
      var args  = arguments;
      var el = this[0];

      if (!el) {
        return;
      }

      // handle .val()
      if (!args.length) {
        return $val.apply(this, arguments);
      }

      // handle .val(...)
      return this.each(function () {
        var el = this;
        var $el = $(el);
        var settings = $.data(el, PLUGIN_NAME);
        var isValidNode = ($.nodeName(el, 'input') || $.nodeName(el, 'textarea'));
        var hasPlaceholderAttr = el._placeholder;

        // only fix jQuery val function for input and textarea elements that has a placeholder
        if (isValidNode && hasPlaceholderAttr) {

          // handle .val(''), .val(null), .val(undefined)
          if (!args[0]) {

            // restore the placeholder
            $el.attr('placeholder', el._placeholder);
          }

          $el.toggleClass(settings.cssClass, !args[0]);
        }

        $val.apply($el, args);
      });
    };
  }

  // copy attributes from a DOM node to a plain object to use later
  function copyAttrs(el) {
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
  }

  // shows specified input
  function showInput($input) {
    $input.css({position: '', left: ''});
  }

  // hides specified input
  function hideInput($input) {
    $input.css({position: 'absolute', left: '-9999em'});
  }

  // Placeholder Enhanced plugin
  $.fn[PLUGIN_NAME] = function (options) {

    // merged options
    var settings = $.extend(DEFAULTS, options);

    // don't do anything if empty set or if placeholder is supported but
    // don't want to normalize modern browsers
    if (!this.length || (HAS_NATIVE_SUPPORT && !settings.normalize)) {
      return;
    }

    // check if options param is destroy method
    if (options === 'destroy') {

      // completely destroy the plugin and return
      return this

        // stay with elements that has the plugin
        .filter(function () {
          return $.data(this, PLUGIN_NAME);
        })

        // remove class
        .removeClass(settings.cssClass)

        // clean other stuff
        .each(function () {
          var el = this;
          var $el = $(el).unbind('.placeholder');
          var isPassword = (el.type === 'password');
          var placeholderTxt = $el.attr('placeholder');

          // do all this only for unsupported browsers
          if (!HAS_NATIVE_SUPPORT) {
            el.value = el.value === placeholderTxt ? '' : el.value;

            // remove fake password input
            if (isPassword) {
              showInput($el);
              $el.prev().unbind('.placeholder').remove();
            }

          // delete backup prop
          } else {
            delete el._placeholder;
          }

          // restore original jQuery .val()
          $.fn.val = $val;

          // plugin off
          $.removeData(el, PLUGIN_NAME);
        });
    }

    return this.each(function () {

      // check if plugin already initialized
      if ($.data(this, PLUGIN_NAME)) {
        return;
      }

      // mark plugin as initialized for the current element at the begining to
      // prevent multiple calls of the plugin for the same set of elements
      $.data(this, PLUGIN_NAME, settings);

      // dom element
      var el = this;

      // jQuery object
      var $el = $(el);

      // current placeholder text
      var placeholderTxt = $el.attr('placeholder');

      // passwords have different treatment
      var isPassword = (el.type === 'password');

      var setPlaceholder = null;
      var removePlaceholder = null;

      // a fake input wil be created for passwords
      var fakePassw;

      // normalize placeholder behaviour and style in modern browsers if normalize mode is on
      if (HAS_NATIVE_SUPPORT && settings.normalize) {
        setPlaceholder = function () {
          if (!el.value) {
            $el.addClass(settings.cssClass).attr('placeholder', placeholderTxt);
          }
        };

        removePlaceholder = function () {
          el._placeholder = placeholderTxt;
          $el.removeAttr('placeholder').removeClass(settings.cssClass);
        };

      // placeholder support for unsupported browsers
      } else if (!HAS_NATIVE_SUPPORT) {
        setPlaceholder = function () {

          // if there is no initial value or initial value is equal to
          // placeholder (done in the $.fn.val wrapper) show the placeholder
          if (!$el.val()) {
            if (isPassword) {
              showInput(fakePassw);
              hideInput($el);
            } else {
              $el.val(placeholderTxt).addClass(settings.cssClass);
            }
          } else if ($el.val() && isPassword) {

            // if there is a value already, we want to remove the fake
            // placeholder. otherwise, we'll have both the fake placeholder
            // and the actual input visible
            removePlaceholder();
          }
        };

        // remove function for inputs and textareas
        if (!isPassword) {
          removePlaceholder = function () {
            if ($el.hasClass(settings.cssClass)) {
              el.value = '';
              $el.removeClass(settings.cssClass);
            }
          };

        // and for password inputs
        } else {
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
            .addClass(settings.cssClass)

            // when focus, trigger real input focus
            .bind(EVENT.FOCUS, function () {
              $el.trigger(EVENT.FOCUS);
            })

            // insert the fake input
            .insertBefore($el);
        }
      }

      // bind events and trigger blur the first time
      $el
        .bind(EVENT.BLUR, setPlaceholder)
        .bind(EVENT.FOCUS, removePlaceholder)
        .trigger(EVENT.BLUR);
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]')[PLUGIN_NAME]();
  });
}(jQuery, document));
