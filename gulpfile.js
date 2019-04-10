const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssvariables = require("postcss-css-variables");
const calc = require("postcss-calc");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const eslint = require("gulp-eslint");
const cleanCSS = require("gulp-clean-css");
const gulpRename = require("gulp-rename");
const gulpFile = require("gulp-file");
const tap = require("gulp-tap");
const path = require("path");
const { argv } = require("yargs");

function reload(done) {
	browserSync.reload();
	done();
}

gulp.task("createJS", function() {
	return gulp.src("./main").pipe(
		tap(function(file) {
			const fileName = path.basename(`${argv.fileName}.js`);
			return gulpFile(fileName, "").pipe(
				gulp.dest("./main/assets/js/components", { overwrite: false })
			);
		})
	);
});

gulp.task("createSCSS", function() {
	return gulp.src("./main").pipe(
		tap(function(file) {
			const fileName = path.basename(`_${argv.fileName}.scss`);
			return gulpFile(fileName, "").pipe(
				gulp.dest("./main/assets/css/components", { overwrite: false })
			);
		})
	);
});

gulp.task("updateStyles", function() {
	return gulp.src("./main").pipe(
		tap(function(file) {
			const fileName = path.basename(`style.scss`);
			const content = `@import "components/${argv.fileName}"`;
			return gulpFile(fileName, content).pipe(
				gulp.dest("./main/assets/css/", { append: true })
			);
		})
	);
});

gulp.task("createHTML", function() {
	return gulp.src("./main").pipe(
		tap(function(file) {
			const fileName = path.basename(`${argv.fileName}.html`);
			const content = `<div class="${argv.fileName}-container">
	<!-- Enter component html here -->
</div>`;
			return gulpFile(fileName, content).pipe(
				gulp.dest("./main/assets/html/components", { overwrite: false })
			);
		})
	);
});

gulp.task("sass", function() {
	return (
		gulp
			.src([
				"main/assets/css/_global.scss",
				"main/assets/css/style.scss",
				"node_modules/bootstrap/scss/bootstrap.scss"
			])
			//Use Expanded for full output of CSS. Use Compressed for minified version
			.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
			.pipe(
				gulpRename(path => {
					path.basename += "-min";
				})
			)
			.pipe(postcss([autoprefixer(), cssvariables({ preserve: true }), calc()]))
			.pipe(gulp.dest("main/assets/css/dist"))
			.pipe(
				browserSync.reload({
					stream: true
				})
			)
	);
});

gulp.task("minify-css", () => {
	return gulp
		.src("main/assets/css/dist/*.css")
		.pipe(cleanCSS({ compatibility: "*" }))
		.pipe(gulp.dest("main/assets/css/components-min"));
});

gulp.task(
	"browserSync",
	gulp.series(function(done) {
		browserSync.init({
			server: {
				baseDir: "main"
			}
		});
		done();
	})
);

gulp.task("scripts", function() {
	return gulp
		.src([
			"main/assets/js/index.js",
			"main/assets/js/util.js",
			"main/assets/js/components/*.js"
		])
		.pipe(babel({ presets: ["es2015"] }))
		.pipe(gulp.dest("main/assets/js/dist"));
});

gulp.task("mini", function() {
	return gulp
		.src("main/assets/js/dist/*.js")
		.pipe(
			uglify({
				compress: {
					drop_debugger: false
				},
				output: {
					comments: false
				}
			})
		)
		.pipe(
			gulpRename(path => {
				path.basename += "-min";
			})
		)
		.pipe(gulp.dest("main/assets/js/components-min"));
});

gulp.task("scripts-loader", function() {
	return gulp
		.src(["main/assets/js/loader-files/load-partials.js"])
		.pipe(babel({ presets: ["es2015"] }))
		.pipe(
			gulpRename(path => {
				path.basename += "-es5";
			})
		)
		.pipe(gulp.dest("main/assets/js/loader-files/"));
});

gulp.task("mini-loader", function() {
	return gulp
		.src("main/assets/js/loader-files/load-partials-es5.js")
		.pipe(
			uglify({
				compress: {
					drop_debugger: false
				},
				output: {
					comments: false
				}
			})
		)
		.pipe(
			gulpRename(path => {
				path.basename += "-min";
			})
		)
		.pipe(gulp.dest("main/assets/js/loader-files/"));
});

gulp.task("concat", function() {
	return gulp
		.src(["main/assets/js/components-min/*-min.js"])
		.pipe(concat("combined-scripts.js"))
		.pipe(gulp.dest("main/assets/js/combined-scripts"));
});

gulp.task("linter", () => {
	return (
		gulp
			.src([
				"main/assets/js/index.js",
				"main/assets/js/components/*.js",
				"main/assets/js/loader-files/load-partials.js"
			])
			// eslint() attaches the lint output to the "eslint" property
			// of the file object so it can be used by other modules.
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failAfterError last.
			.pipe(eslint.failAfterError())
	);
});

gulp.task("everything", gulp.series(["scripts", "mini", "concat"]));
gulp.task("loader", gulp.series(["scripts-loader", "mini-loader"]));
gulp.task("createComp", gulp.series(["createJS", "createSCSS", "updateStyles", "createHTML"]));

gulp.task(
	"watch",
	gulp.series(["browserSync", "sass", "linter", "scripts", "mini", "concat"], function() {
		gulp.watch("main/assets/css/style.scss", gulp.series(["sass"]));
		gulp.watch("main/assets/css/components/*.scss", gulp.series(["sass"]));
		gulp.watch("main/*.html", gulp.series(reload));
		gulp.watch("main/assets/html/components/*.html", gulp.series(reload));
		gulp.watch("main/assets/js/index.js", gulp.series(["linter"]));
		gulp.watch("main/assets/js/load-partials.js", gulp.series(["linter"]));
		gulp.watch("main/assets/js/components/*.js", gulp.series(["linter"]));
		gulp.watch("main/assets/js/index.js", gulp.series(["scripts"]));
		gulp.watch("main/assets/js/load-partials.js", gulp.series(["scripts"]));
		gulp.watch("main/assets/js/components/*.js", gulp.series(["scripts"]));
		gulp.watch("main/assets/js/dist/*.js", gulp.series(["mini"]));
		gulp.watch("main/assets/js/components-min/*-min.js", gulp.series(["concat"]));
		gulp.watch("main/assets/js/**/*.js", gulp.series(reload));
	})
);
