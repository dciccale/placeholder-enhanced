/*!
 * jQuery Placeholder Enhanced 1.6.0
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under MIT license
 * https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt
 */
(function ($, doc) {

  // my name
  var PLUGIN_NAME = 'placeholderEnhanced';

  // if browser supports placeholder attribute,
  // use native events to show/hide placeholder
  var HAS_NATIVE_SUPPORT = 'placeholder' in doc.createElement('input') && 'placeholder' in doc.createElement('textarea');

  // events namespaces
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

  // for wrapping $().val()
  var $val;

  /*
   * if placeholder is not supported, the jQuery val function
   * returns the placeholder, wrap the val function to fix this.
   * useful when using $().val() or $().serialize()
   * or any other jQuery method that uses $().val()
   */
  if (!HAS_NATIVE_SUPPORT) {
    $val = $.fn.val;
    $.fn.val = function () {
      var $el = this
      var el = $el[0];
      if (!el) {
        return;
      }
      if (!arguments.length && ($.nodeName(el, 'input') || $.nodeName(el, 'textarea'))) {
        return el.value === $el.attr('placeholder') ? '' : el.value;
      } else {
        if ($el.hasClass(DEFAULTS.cssClass)) {
          $el.removeClass(DEFAULTS.cssClass);
        }
        return $val.apply($el, arguments);
      }
    };
  }

  // Placeholder Enhanced plugin
  $.fn[PLUGIN_NAME] = function (options) {

    /*
     * don't do anything if:
     * empty set
     * placeholder supported but don't want to normalize modern browsers
     */
    if (!this.length || (HAS_NATIVE_SUPPORT && !DEFAULTS.normalize)) {
      return;
    }

    // merged options
    var settings = $.extend(DEFAULTS, options);

    // check if options param is destroy method
    if (options === 'destroy') {
      // completely destroy the plugin and return
      return this
        // stay with elements that has the plugin
        .filter(function () { return $.data(this, PLUGIN_NAME); })
        // remove class
        .removeClass(settings.cssClass)
        // clean other stuff
        .each(function () {
          var el = this;
          var $el = $(el).unbind('.placeholder');
          var isPassword = (el.type === 'password');
          // do all this only for unsupported browsers
          if (!HAS_NATIVE_SUPPORT) {
            el.value = '';
            // remove fake password input
            if (isPassword) {
              showInput($el);
              $el.prev().unbind('.placeholder').remove();
            }
          }
          // plugin off
          $.removeData(el, PLUGIN_NAME);
        });
    }

    // copy attributes from a DOM node to a plain object to use later
    function copyAttrs(element) {
      var attrs = {};
      var exclude = ['placeholder', 'name', 'id'];
      $.each(element.attributes, function (i, attr) {
        if (attr.specified && $.inArray(attr.name, exclude) < 0) {
          attrs[attr.name] = attr.value;
        }
      });
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

    return this.each(function () {

      // check if plugin already initialized
      if ($.data(this, PLUGIN_NAME)) {
        return;
      }

      // actual dom
      var el = this;
      // jQuery object
      var $el = $(el);
      // current placeholder text
      var placeholderTxt = $el.attr('placeholder');
      // passwords have different treatment
      var isPassword = (el.type === 'password');
      var setPlaceholder
      var removePlaceholder
      var fakePassw;

      // normalize behaviour in modern browsers
      if (HAS_NATIVE_SUPPORT && settings.normalize) {
        setPlaceholder = function () {
          if (!$el.val()) {
            $el.addClass(settings.cssClass).attr('placeholder', placeholderTxt);
          }
        };

        removePlaceholder = function () {
          $el.removeAttr('placeholder').removeClass(settings.cssClass);
        };

      // placeholder support for older browsers
      } else if (!HAS_NATIVE_SUPPORT) {
        setPlaceholder = function () {
          // if there is no initial value
          // or initial value is equal to placeholder (done in the $.fn.val wrapper)
          // show the placeholder
          if (!$el.val()) {
            if (isPassword) {
              showInput(fakePassw);
              hideInput($el);
            } else {
              $el.val(placeholderTxt).addClass(settings.cssClass);
            }
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

        // for password inputs
        } else if (!HAS_NATIVE_SUPPORT) {
          removePlaceholder = function () {
            showInput($el);
            hideInput(fakePassw);
          };

          // create a fake password input
          fakePassw = $('<input>', $.extend(copyAttrs(el), {
            'type': 'text',
            value: placeholderTxt,
            tabindex: -1 // skip tabbing
          })).addClass(settings.cssClass)
            // when focus, trigger real input focus
            .bind(EVENT.FOCUS, function () {
              $el.trigger(EVENT.FOCUS);
            })
            // insert fake input
            .insertBefore($el);
        }
      }

      // bind events and trigger blur the first time
      $el
        .bind(EVENT.BLUR, setPlaceholder)
        .bind(EVENT.FOCUS, removePlaceholder)
        .trigger(EVENT.BLUR);

      // mark plugin as initialized for the current element
      $.data(el, PLUGIN_NAME, true);
    });
  };

  // auto-initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]')[PLUGIN_NAME]();
  });
}(jQuery, document));
