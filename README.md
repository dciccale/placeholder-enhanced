# jQuery Placeholder Enhanced 1.4

### This is the Enhanced jQuery Placeholder plugin

## Features

- Cross-browser & Cross-styling HTML5 placeholder attribute
- Support for password, textarea, text, email, search, url, etc...
- Lightweight: **712 bytes** compressed & gzipped

## Usage

Just include the js file after jQuery, on your HTML page and the plugin will automatically be initialized

```html
<script src="jquery.js"></script>
<script src="jquery.placeholder-enhanced.js"></script>
```

If you want to initialize the plugin yourself, just call the plugin lik this:

```javascript
$('input[placeholder], textarea[placeholder]').placeholderEnhanced();
```

Or if you want to initialize the plugin after loading an HTML page via AJAX just call the plugin after the content is loaded.

For example:
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

### CSS
Customize the style of the placeholder with CSS
See [placeholder-enhanced.css](https://github.com/dciccale/placeholder-enhanced/blob/master/css/placeholder-enhanced.css)

## Demo
For a demo see [demo.html](https://github.com/dciccale/placeholder-enhanced/blob/master/demo.html) [online](http://dciccale.github.com/placeholder-enhanced/)

*Requires jQuery 1.4.4 or higher*

## License
See [LICENSE.txt](https://raw.github.com/dciccale/placeholder-enhanced/master/LICENSE.txt)

