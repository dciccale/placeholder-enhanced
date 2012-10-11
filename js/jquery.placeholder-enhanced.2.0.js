/*!
 * jQuery Placeholder Enhanced 2.0 beta
 * Copyright (c) 2012 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
 */
(function ($) {

  var pluginName = 'placeholderEnhanced',
    // if browser supports placeholder attribute, use native events to show/hide placeholder
    hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    events = {
      focus: 'focus.placeholder',
      blur: 'blur.placeholder',
      submit: 'submit.placeholder'
    },
    defaults = {
      // placeholder css class
      className: 'placeholder'
    },
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
        if (this.hasClass(defaults.className)) {
          this.removeClass(defaults.className);
        }
        return $val.apply(this, arguments);
      }
    };
  }

  // constructor
  function PlaceholderEnhanced(element, options) {
    $.data(element, pluginName, this);
    this.el = element;
    this.$el = $(this.el);
    this.placeholderTxt = this.$el.attr('placeholder');
    this.isPassword = (this.el.type === 'password');
    this.options = $.extend(defaults, options);
    this.init();
  }

  // copy attributes from a password input to a fakePassw
  function copyAttrs(element) {
    var attrs = {}, exclude = ['placeholder', 'name', 'id'];
    $.each(element.attributes, function (i, attr) {
      if (attr.specified && exclude.indexOf(attr.name) < 0) {
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

  PlaceholderEnhanced.prototype.init = function () {
    var that = this,
      placeholderTxt = that.placeholderTxt,
      isPassword = that.isPassword,
      fakePassw;

    // on focus
    function removePlaceholder() {
      if (that.$el.hasClass(that.options.className)) {
        if (!hasNativeSupport) {
          that.el.value = '';
        }
        that.$el.removeClass(that.options.className);
      }
    }

    // on blur
    function setPlaceholder() {
      // if there is no initial value
      // or initial value is equal to placeholder (done in the fn.val wrapper)
      // init the placeholder
      if (!that.$el.val()) {
        if (!hasNativeSupport) {
          if (!isPassword) {
            that.$el.val(placeholderTxt).addClass(that.options.className);
          } else {
            showInput(fakePassw);
            hideInput(that.$el);
          }
        } else {
          that.$el.addClass(that.options.className);
        }
      }
    }

    // placeholder for textarea and non-password inputs
    if (!isPassword || hasNativeSupport) {
      that.$el.bind(events.focus, removePlaceholder);

    // placeholder for password
    } else {
      // create a fakePassw input
      // tabindex="-1" to skip tabbing
      fakePassw = $('<input>', $.extend(copyAttrs(that.el), {
        'type': 'text',
        value: placeholderTxt,
        tabindex: -1
      }))
        // add placeholder class
        .addClass(that.options.className)
        // when fakePassw has focus, trigger password focus
        .bind(events.focus, function () {
          that.$el.trigger(events.focus);
        })
        // insert the fakePassw input
        .insertBefore(that.$el);

      // when password input has focus, show the real password input and hide the fakePassw one
      that.$el.bind(events.focus, function () {
        showInput(that.$el);
        hideInput(fakePassw);
      });
    }

    // bind blur event and trigger it the first time
    that.$el.bind(events.blur, setPlaceholder).trigger(events.blur);
  };

  // add the plugin to jQuery
  $.fn[pluginName] = function (options) {

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
          $(this).bind(events.submit, function () {
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

    return this.each(function () {
      if (!$.data(this, pluginName)) {
        new PlaceholderEnhanced(this, options);
      }
    });
  };

  // initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });

}(jQuery));