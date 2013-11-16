/*!
 * jQuery Placeholder Enhanced 1.6.7
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

  // save original jQuery .val() function
  var $val = $.fn.val;

  /*
   * handle the use of jQuery .val(), if placeholder is not supported
   * the .val() function returns the placeholder value, wrap the val
   * function to fix this, also useful when using .serialize() or any other
   * jQuery method that uses .val()
   */

    // new .val() function for unsupported browsers
    if (!HAS_NATIVE_SUPPORT) {
      $.fn.val = function () {
        var args = arguments;
        var el = this[0];
        if (!el) { return; }

        var $el = $(el);

        // handle .val()
        if (!args.length){
          if ($.nodeName(el, 'input') || $.nodeName(el, 'textarea')) {
            return el.value === $el.attr('placeholder') ? '' : el.value;
          } else{
            $val.apply($el, args);
          }
        }

        return this.each(function(){
            var el = this;
            var $el = $(this);

            // handle .val(''), .val(null), .val(undefined)
            if (!args[0] && $el.attr('placeholder')) {
              el.value = $el.addClass(DEFAULTS.cssClass).attr('placeholder');
              // handle .val('value')
            } else {
              $el.removeClass(DEFAULTS.cssClass);
              $val.apply($el, args);
            }
        });
      };
        // new .val() function for modern browsers when normalize mode is on
    } else if (HAS_NATIVE_SUPPORT && DEFAULTS.normalize) {
      $.fn.val = function () {
          var args  = arguments;
          var el = this[0];
          if (!el) {
            return;
          }

          // handle .val()
          if (!args.length) {
            return el.value;
          }
          return this.each(function(){
            var el = this;
            var $el = $(this);
            // handle .val(''), .val(null), .val(undefined)
            if (!args[0] && el._placeholder) {
              $el.attr('placeholder', el._placeholder);
            }

            $el.toggleClass(DEFAULTS.cssClass, !args[0]);
            // handle .val('value')
            $val.apply($el, args);
          });
      };
    }

  // Placeholder Enhanced plugin
  $.fn[PLUGIN_NAME] = function (options) {

    // merged options
    var settings = $.extend(DEFAULTS, options);

    /*
     * don't do anything if:
     * empty set
     * placeholder supported but don't want to normalize modern browsers
     */
    if (!this.length || (HAS_NATIVE_SUPPORT && !settings.normalize)) {
      return;
    }

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
      var setPlaceholder;
      var removePlaceholder;
      var fakePassw;

      // normalize behaviour in modern browsers
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
          } else if ($el.val() && isPassword) {
              // if there is a value already, we want to remove the fake placeholder
              // otherwise, we'll have both the fake placeholder and the actual input visible
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
