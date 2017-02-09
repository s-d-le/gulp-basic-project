Gulp Basic Project
========================

An almost barebone gulp project with angular(1), pug(jade), sass, localhost, live-reload and more... This has been used very successfully for my various small and commercial level projects. Best suited for beginner developers who just started getting used to node. I know this can be structured a lot better, especially for scaling but this is a decent start. What it does:

* Run localhost without using xampp or wamp 
* Watch changes on js, scss and pug files then reload browser
* Audible beep and terminal log on errors
* Compile min.js, min.css
* Compress images

Structure
---------

	gulp-basic-project
		|-dist
		|-node-modules
		|-src
			|-controllers
			|-lib
				|-bower-components
				|-images
				|-fonts
			|-scripts
			|-styles
				|-base
				|-components
			|-views

Usage
-----
Make sure node is installed. Clone the project. Open terminal and `cd` to the project folder

	npm install -g gulp
	npm install
	bower install

On the **first time** running the project use `gulp init` Then `gulp`
Now you can start making changes on the files. 

To access the `index.html` through browser: `localhost:9001/views/`

When new fonts, images or files are added, its best to run `gulp init` once to add the files to `dist`

Todo
----

* Move `lib` to root for better assets management
* Adding a path to bower component's .min.js files should be automated
* There should be an `index.html` in the root level of `dist` so access to views doesn't have to go through `/views/`

License
-------

MIT