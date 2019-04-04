const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssvariables = require("postcss-css-variables");
const calc = require("postcss-calc");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const eslint = require("gulp-eslint");
const cleanCSS = require("gulp-clean-css");
const gulpRename = require("gulp-rename");

function reload(done) {
	browserSync.reload();
	done();
}

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
		.src(["main/assets/js/index.js", "main/assets/js/components/*.js"])
		.pipe(babel({ presets: ["es2015"] }))
		.pipe(gulp.dest("main/assets/js/dist"));
});

gulp.task("mini", function() {
	return gulp
		.src("main/assets/js/dist/*.js")
		.pipe(minify({ noSource: true }))
		.pipe(gulp.dest("main/assets/js/components-min"));
});

gulp.task("concat", function() {
	return gulp
		.src("main/assets/js/components-min/*-min.js")
		.pipe(concat("combined-scripts.js"))
		.pipe(gulp.dest("main/assets/js/combined-scripts"));
});

gulp.task("linter", () => {
	return (
		gulp
			.src(["main/assets/js/index.js"])
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

gulp.task(
	"watch",
	gulp.series(["browserSync", "sass", "linter", "scripts", "mini", "concat"], function() {
		gulp.watch("main/assets/css/style.scss", gulp.series(["sass"]));
		gulp.watch("main/assets/css/components/*.scss", gulp.series(["sass"]));
		gulp.watch("main/*.html", gulp.series(reload));
		gulp.watch("main/assets/js/index.js", gulp.series(["linter"]));
		gulp.watch("main/assets/js/components/*.js", gulp.series(["linter"]));
		gulp.watch("main/assets/js/index.js", gulp.series(["scripts"]));
		gulp.watch("main/assets/js/components/*.js", gulp.series(["scripts"]));
		gulp.watch("main/assets/js/dist/*.js", gulp.series(["mini"]));
		gulp.watch("main/assets/js/components-min/*-min.js", gulp.series(["concat"]));
		gulp.watch("main/assets/js/**/*.js", gulp.series(reload));
	})
);
