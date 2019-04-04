Built off of Cody House: https://github.com/CodyHouse/codyhouse-framework

TO RUN:

```
npm install
npm run gulp watch
```

To push to github pages: 

```
git subtree push --prefix main origin gh-pages
```

The framework is composed of:

-   **A collection of SCSS files** that compile into a \_global.scss file. Make sure to import this style before your own;
-   **A util.js file** with some utility functions that are used in the [CodyHouse components](https://codyhouse.co/ds/components). Make sure to import this before the component script file.

```text
Sample-Scaffold/
└── main/
    ├── assets/
    │   ├── css/
    │   │   ├── components/
    │   │   │   ├── Project Components (CSS)
    │   │   ├── dist/
    │   │   │   ├── bootstrap.css
    │   │   │   ├── style.css
    │   │   │   ├── Compiled and Minyfied styles
    │   │   ├── globals/
    │   │   │   ├── _accessibility.scss
    │   │   │   ├── _alignment.scss
    │   │   │   ├── _breakpoints.scss
    │   │   │   ├── _buttons.scss
    │   │   │   ├── _colors.scss
    │   │   │   ├── _common-variables.scss
    │   │   │   ├── _forms.scss
    │   │   │   ├── _grid-layout.scss
    │   │   │   ├── _icons.scss
    │   │   │   ├── _mixins.scss
    │   │   │   ├── _reset.scss
    │   │   │   ├── _shared-styles.scss
    │   │   │   ├── _spacing.scss
    │   │   │   ├── _typography.scss
    │   │   │   ├── _visibility.scss
    │   │   │   └── _z-index.scss
    │   │   ├── _globals.scss
    │   │   ├── style.css
    │   │   └── style.scss
    │   └── js/
    │       ├── combined-scripts/
    │       │   ├── combined-scripts.js
    │       ├── components/
    │       │   ├── Project Components (JS)
    │       ├── components-min/
    │       │   ├── index-min.js
    │       │   ├── Minyfied JS Files
    │       ├── dist/
    │       │   ├── index.js
    │       │   ├── Babel processed JS files
    │       └── index.js
    │       └── util.js
    └── index.html
```

## Progressive enhancement

The Framework and the Components are built following the principle of progressive enhancement. Please make sure to include the following script in the `<head>` of your document:

```html
<script>
	document.getElementsByTagName("html")[0].className += " js";
</script>
```

The script is used in CSS to target that Javascript is enabled and apply additional style accordingly. If you don't include the script, part of the style of the components won't be visible.

## Gulp

The framework includes a Gulp file with some basic configurations needed to run a web project based on the framework.

To use this Gulp configuration file, once you have downloaded the framework, make sure to run the following commands in your command line:

```
npm install
npm run gulp watch
```

The first command will install the modules the framework requires for compiling SCSS into CSS; the second will launch your project on a development server.

If you are new to Gulp, take a look at this [beginners guide](https://css-tricks.com/gulp-for-beginners/).

## Components

CodyHouse's components are HTML, CSS, JS production-ready modules. Each component is accessible, responsive, and work seamlessly with the CodyHouse Framework.

[Explore the Components](https://codyhouse.co/ds/components)

## Global Editors

The Global Editors are web design tools that allow you to set the style of typography elements, color themes, spacing rules, buttons, and forms directly in the browser. They generate SCSS code that is compatible with the CodyHouse framework.

Explore the Editors:

-   **Colors** [codyhouse.co/ds/globals/colors](https://codyhouse.co/ds/globals/colors)
-   **Typography** [codyhouse.co/ds/globals/typography](https://codyhouse.co/ds/globals/typography)
-   **Spacing** [codyhouse.co/ds/globals/spacing](https://codyhouse.co/ds/globals/spacing)
-   **Buttons** [codyhouse.co/ds/globals/buttons](https://codyhouse.co/ds/globals/buttons)
-   **Forms** [codyhouse.co/ds/globals/forms](https://codyhouse.co/ds/globals/forms)
