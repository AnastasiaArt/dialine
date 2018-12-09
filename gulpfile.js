"use strict";

var gulp = require("gulp");
var server = require("browser-sync").create();
var purify = require("gulp-purifycss");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var spritesmith = require("gulp.spritesmith");
var del = require("del");
var htmlmin  =  require ("gulp-htmlmin");

gulp.task("delete", function() {
  return del("build");
});

gulp.task('cssmin', function() {
  return gulp.src("files/css/*.css")
    .pipe(concat("main.css"))
    .pipe(purify(["files/js/*.js", "index.html"]))
    .pipe(gulp.dest("files/css"));
});

gulp.task("css", function() {
  return gulp.src("files/css/main.css")
  .pipe(csso())
  .pipe(rename("style-min.css"))
  .pipe(gulp.dest("build/files/css"))
  .pipe(server.stream());
});

gulp.task("scripts", function() {
    return gulp.src("files/js/*.js")
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/files/js"));
});

gulp.task("images", function() {
  return gulp.src("files/img/*.{png,jpg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel:3}),
    imagemin.jpegtran({progressive:true})
  ]))
  .pipe(gulp.dest("build/files/img"));
});

gulp.task("html", function() {
  return gulp.src("*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  })

  gulp.watch("files/css/*.css", gulp.series("css"));
  gulp.watch("files/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "delete",
  "cssmin",
  "images",
  "css",
  "scripts",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
