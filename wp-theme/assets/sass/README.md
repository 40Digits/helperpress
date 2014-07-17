# 40D Semantic SASS

Installation
------------
1. You'll need to generate the configuration using your GUI tool or the command line: `compass config [path/to/config_file.rb]`
2. You can then go in and set your directories and whatnot.

Documentation
-------------
*Overview of the framework*
`http://wiki.40digits.net/40d-sass-introduction-to-the-framework`

*Category with all posts regarding the framework*
`http://wiki.40digits.net/category/learning/documentation/40d-sass-framework`


SASS/SCSS Conversion
--------------------
Please keep this repository in SCSS format before all commits. If you prefer SASS, you can convert using the following command:

*SCSS -> SASS*

`sass-convert -R --from scss --to sass scss sass && rm -rf scss`

...and then **back to SCSS before you commit:**

*SASS -> SCSS*

`sass-convert -R --from sass --to scss sass scss && rm -rf sass`

## CHANGELOG

### May 23, 2014

#### General
1. Updated documentation and comments throughout the Sass files.
2. Started working on a SASS 3.3 Media Query Mixin

#### /mixins/mix-fonts
1. Merged /modules/fonts.scss into /mixins/mix-fonts.scss
2. Moved @font-face @import to the top of file
3. Added in area to define your font weights for other developers

#### /mixins/mix-utilities
1. Added a mixin cf() and placeholder %cf. Not all instances will call for a one fit all solution.
2. Added **%visuallyhidden** placeholder. This is to help with screen readers. Instead of removing an element with *display:none*, we are making sure it's visually hidden.
3. Added OSX Firefox font-smoothing fix to coincide with the Chrome one.
4. Added **%naked-list** and **%naked-button** placeholders to make resetting of lists or buttons easier.
5. Removed CSS Transitions as they can be handled by Compass.

#### /modules/colors
1. Moved color variables into their own file to keep the variables cleaner.
2. Added updated documentation on naming conventions.

#### /modules/input
1. Added some Firefox reset styles for mobile
2. Added browser specific hacks

#### /modules/default
1. Added font optimizations on html
2. Removed clear functions into utilities.
3. Added definition lists to text components.
4. Added class helpers **.cf, .clear, .visuallyhidden**

#### /modules/variables
1. Moved colored variables into their own file.
2. Now you only have to adjust the Mobile First Variables. The Max Width variables will be adjusted automatically.

#### /vendor/gravity-forms
1. Added default styles that are easier to work with if you choose to disable the Gravity Forms CSS.
2. You can still use almost most of the Gravity Forms classes as it's been built around it.