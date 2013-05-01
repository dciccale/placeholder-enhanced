# jQuery Placeholder Enhanced 1.5.1

### jQuery Placeholder plugin is an enhanced polyfill for the HTML5 placeholder attribute.

## Features

- Cross-browser & Cross-styling
- Support for all input types, password, textarea, text, email, search, url, etc...
- Robust: it heavely behave as the HTML5 placeholder defined in the specs
- Lightweight: **715 bytes** compressed & gzipped

## Usage

Just include the js file after jQuery on your HTML page and the plugin will be automatically initialized

```html
<script src="jquery.js"></script>
<script src="jquery.placeholder-enhanced.js"></script>
```

If you want to initialize the plugin yourself after the first auto-initialize (for example after ajax content being
loaded), just call the plugin lik this:

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

## CSS
Customize the style of the placeholder with CSS in a cross-browser manner (even for browsers that natively supports placeholder)
See [placeholder-enhanced.css](https://github.com/dciccale/placeholder-enhanced/blob/master/css/placeholder-enhanced.css)

## Demo
For a demo see [demo.html](https://github.com/dciccale/placeholder-enhanced/blob/master/demo.html) [online](http://dciccale.github.com/placeholder-enhanced/)

*Requires jQuery 1.4.4 or higher*

## License
See [LICENSE.txt](https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)
