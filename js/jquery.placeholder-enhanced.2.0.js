 /*!
  * jQuery Placeholder Enhanced 2.0 beta
  * Copyright (c) 2012 Denis Ciccale (@tdecs)
  * Released under MIT license (https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
  */
(function ($, document) {

  var pluginName = 'placeholderEnhanced',
    defaults = {
      className: 'placeholder'
    },
    hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
    $val = $.fn.val;

  // constructor
  function PlaceholderEnhanced(element, options) {
    $.data(element, pluginName, this);
    this.element = $(element);
    this.options = $.extend({}, defaults, options);
    this._hasNativeSupport = hasNativeSupport;
    this.init();
  }

  PlaceholderEnhanced.prototype.init = function () {
    var self = this,
      placeholderText = this.element.attr('placeholder'),
      isPassword = this.element.attr('type') === 'password',
      fakePassword;

    if (!isPassword && !self._hasNativeSupport) {
      this.element.addClass(this.options.className).val(placeholderText);
    }

    function removePlaceholder() {
      if (!self.element.val() && self.element.hasClass(self.options.className)) {
        if (!self._hasNativeSupport) {
          self.element.val('');
        }
        self.element.removeClass(self.options.className);
      }
    }

    function togglePassword(ev) {
      var isFocus = (ev && ev.type === 'focus'),
        input1 = isFocus ? fakePassword : self.element,
        input2 = isFocus ? self.element : fakePassword;

      input1.css({position: 'absolute', left: '-9999em'});
      input2.removeAttr('style');
    }

    function setPlaceholder(ev) {
      if (!self.element.attr('value')) {
        if (!self._hasNativeSupport) {
          if (!isPassword) {
            self.element.addClass(self.options.className).val(placeholderText);
          } else {
            togglePassword(ev);
          }
        } else {
          self.element.addClass(self.options.className);
        }
      } else {
        self.element.removeClass(self.options.className);
      }
    }

    function copyAttrs(element) {
      var attrs = {};
      $.each(element[0].attributes, function (i, a) {
        if (a.name !== 'placeholder' && a.name !== 'name') {
          attrs[a.name] = a.value;
        }
      });
      return attrs;
    }

    // placeholder for text and textarea
    if (!isPassword || this._hasNativeSupport) {
      this.element.on('focus.placeholder', removePlaceholder);

    // placeholder for password
    } else {
      // create input with tabindex="-1" to skip tabbing
      fakePassword = $('<input>', $.extend(copyAttrs(this.element), {
        'type': 'text',
        value: placeholderText,
        tabindex: -1
      }))
        .addClass(this.options.className);

      // trigger password focus when focus is on text input
      fakePassword.on('focus.placeholder', function () {
        self.element.trigger('focus.placeholder');
      });

      // insert the text input
      this.element.before(fakePassword).on('focus.placeholder', togglePassword);
      togglePassword();
    }

    // bind blur event and trigger on load
    this.element.on('blur.placeholder', setPlaceholder);
  };

  // add the plugin to jQuery
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, pluginName)) {
        new PlaceholderEnhanced(this, options);
      }
    });
  };

  if (!hasNativeSupport) {
    // if placeholder is not supported, the jQuery val function returns the placeholder
    // wrap the jQuery val function to fix this
    $.fn.val = function (value) {
      var placeholderAttr = this.attr('placeholder'), placeholderClass;
      if (!arguments.length && placeholderAttr) {
        placeholderClass = $.data(this[0], pluginName).options.className;
        return this.attr('value') === placeholderAttr && this.hasClass(placeholderClass) ? '' : this.attr('value');
      } else {
        return $val.apply(this, arguments);
      }
    };

  }

  // initialize the plugin
  $(function () {
    $('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });

}(jQuery, document));
