# Placeholder Enhanced 1.6.9

### This jQuery Placeholder plugin is an enhanced polyfill for the HTML5 placeholder attribute.

## Features

- Cross-browser & Cross-styling
- Support for all input types, password, textarea, text, email, search, url, etc...
- Robust: it heavely behave as the HTML5 placeholder defined in the specs
- Normalize placeholder behaviour in modern browsers (optional). This means the placeholder will
  hide on input focus.
- Fix jQuery.val() function to work as expected to set/get the value of inputs with placeholder
- Lightweight: **970 bytes** minified & gzipped

*Requires jQuery 1.4.4 or higher*

## Installation

```
bower install placeholder-enhanced
```

or download this repo

## Usage

Just include the js file after jQuery on your HTML page and the plugin will be automatically initialized

```html
<script src="jquery.js"></script>
<script src="jquery.placeholder-enhanced.js"></script>
```

If you want to initialize the plugin yourself after the first auto-initialize (for example after ajax content being
loaded), just call the plugin like this:

```javascript
$('input[placeholder], textarea[placeholder]').placeholderEnhanced();
```

### Example:

Initialize the plugin after loading an HTML page via AJAX, call the plugin after the content is loaded.

```javascript
$(function () {
  $.get('file.html', function (html) {
    $('#container')
      // append the html
      .append(html)
      // find any inputs or textareas with placeholder and initialize the plugin
      .find('input[placeholder], textarea[placeholder]').placeholderEnhanced();
  });
})
```

### Destroy

If you want to destroy the plugin call:

```javascript
$('input[placeholder], textarea[placeholder]').placeholderEnhanced('destroy');
```

It will automatically clean all what the plugin first created as if it was never initialized, only for the selected elements.

## CSS

Customize the style of the placeholder with CSS in a cross-browser manner:

See [placeholder-enhanced.css](https://github.com/dciccale/placeholder-enhanced/blob/master/css/placeholder-enhanced.css)

## Demo

For a demo see [demo.html](https://github.com/dciccale/placeholder-enhanced/blob/master/demo.html) **[online](http://dciccale.github.com/placeholder-enhanced/)**

## Build

If you want to work on the plugin there is a Makefile with two targets:

To lint with jshint

```sh
$ make lint
```

Minify the js file

```sh
$ make build
```

## TODO

These are not major tasks, but nice to have:

- Create a [kimbo.js](http://kimbojs.com) plugin version.
- Create a plain JavaScript version?
- Create two separate versions.
  - Version 1.x to give *full* cross-browser support and normalization. (current version)
  - Version 2.x only to normalize *modern browsers* placeholder behaviour.

## License

See [LICENSE.txt](https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
