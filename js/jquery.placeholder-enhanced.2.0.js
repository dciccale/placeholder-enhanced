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

  // if placeholder is not supported, the jQuery val function returns the placeholder
  // wrap the jQuery val function to fix this
  if (!hasNativeSupport) {
    $.fn.val = function (value) {
      if (!this.length) {
        return;
      }
      var placeholderAttr = this.attr('placeholder'), placeholderClass;
      if (!arguments.length && placeholderAttr) {
        placeholderClass = $.data(this[0], pluginName).options.className;
        return this.attr('value') === placeholderAttr && this.hasClass(placeholderClass) ? '' : this.attr('value');
      } else {
        return $val.apply(this, arguments);
      }
    };
  }

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
      $.each(element.attributes, function (i, attr) {
        if (attr.specified && attr.name !== 'placeholder' && attr.name !== 'name') {
          attrs[attr.name] = attr.value;
        }
      });
      return attrs;
    }

    // placeholder for text and textarea
    if (!isPassword || self._hasNativeSupport) {
      self.element.on('focus.placeholder', removePlaceholder);

    // placeholder for password
    } else {
      // create input with tabindex="-1" to skip tabbing
      fakePassword = $('<input>', $.extend(copyAttrs(self.element[0]), {
        'type': 'text',
        value: placeholderText,
        tabindex: -1
      }))
        .addClass(self.options.className)
        // trigger password focus when focus is on text input
        .on('focus.placeholder', function () {
          self.element.trigger('focus.placeholder');
        })
        .insertBefore(self.element);

      // insert the text input
      self.element.on('focus.placeholder', togglePassword);
      togglePassword();
    }

    // bind blur event and trigger on load
    self.element.on('blur.placeholder', setPlaceholder);
  };

  // add the plugin to jQuery
  $.fn[pluginName] = function (options) {
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

}(jQuery, document));
