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

function reload(done) {
    browserSync.reload();
    done();
}

gulp.task("sass", function() {
    return gulp
        .src("main/assets/css/**/*.scss")
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(
            postcss([autoprefixer(), cssvariables({ preserve: true }), calc()])
        )
        .pipe(gulp.dest("main/assets/css"))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
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

gulp.task(
    "watch",
    gulp.series(["browserSync", "sass"], function() {
        gulp.watch("main/assets/css/**/*.scss", gulp.series(["sass"]));
        gulp.watch("main/*.html", gulp.series(reload));
        gulp.watch("main/assets/js/**/*.js", gulp.series(reload));
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

gulp.task("everything", gulp.series(["scripts", "mini", "concat"]));
