var gulp = require("gulp");
var concat = require("gulp-concat");
var browserSync = require("browser-sync").create();
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var postcss = require("gulp-postcss");
var uglify = require("gulp-uglifyjs");

gulp.task("default", ["build"]);
gulp.task("dev", ["build", "browserSync", "watch"]);
gulp.task("build", ["styles", "html", "js", "assets", "fonts"]);

gulp.task("styles", function() {
	return gulp.src("./src/styles/**/*.css")
		.pipe(concat("bundle.min.css"))
		.pipe(postcss([autoprefixer, cssnano]))
		.pipe(gulp.dest("./public/styles/"));
});

gulp.task("html", function() {
	return gulp.src("./src/*.html")
		.pipe(gulp.dest("./public/"));
});

gulp.task("assets", function() {
    gulp.src("./src/assets/**/*.{svg,jpg,png}")
        .pipe(gulp.dest("./public/assets/"));
});

gulp.task("fonts", function() {
    gulp.src("./src/fonts/**/*.ttf")
        .pipe(gulp.dest("./public/fonts/"));
});

gulp.task("js", function() {
	return gulp.src("./src/scripts/**/*.js")
		.pipe(concat("bundle.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("./public/scripts/"));
});

gulp.task("browserSync", function () {
	browserSync.init({
    	server: {
			baseDir: "./public"
    	}
	});
});

gulp.task("watch", function() {
	gulp.watch("./src/styles/**/*.css", ["styles"]);
	gulp.watch("./src/*.html", ["html"]);
	gulp.watch("./src/scripts/**/*.js", ["js"]);
	gulp.watch('./src/**/*.*', browserSync.reload);
});
