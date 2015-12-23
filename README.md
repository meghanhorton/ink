Ink (Foundation for Email)
===

Ink is a responsive email framework, used to make HTML emails look great on any client or device.  It includes a 12-column grid, as well as some simple UI elements for rapid prototyping.

Homepage:      http://zurb.com/ink<br />
Documentation: http://zurb.com/ink/docs.php<br />
Download:      http://zurb.com/ink/download.php

Ink is MIT-licensed and absolutely free to use. Ink wouldn't be possible without the support of the entire ZURB team, our friends and colleagues who gave feedback, and some luminaries who did some heavy lifting that we took advantage of (thanks guys).

Installation
===========

``` 
cd ink
npm install -g grunt-cli 
```

How to run
===========

To develop templates with LiveReload (no inlining):
``` 
grunt dev 
```

To develop templates with LiveReload (inlining):
``` 
grunt dev:inline
```

To build:
``` 
grunt
```
or
``` 
grunt deploy:downloads
```

Additions
=========

This version adds
* [grunt-premailer](https://github.com/dwightjack/grunt-premailer) to generate inline styles
* [grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass) to compile SASS


