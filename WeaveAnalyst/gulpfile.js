/**
 * gulp build file for the Weave Analyst
 * @author shweta purushe
 */

var gulp = require('gulp');

//including the concat plugin
var concat = require('gulp-concat');

//defining the concat task
gulp.task('concatScripts', function(){
	return gulp.src('app/src/**/**/*.js')
			   .pipe(concat('wa_main.js'))
			   .pipe(gulp.dest('app/dist'));
});

gulp.task('concatStyles', function(){
	return gulp.src('app/css/*.css')
			   .pipe(concat('wa.css'))
			   .pipe(gulp.dest('app/dist'));
});

//default task which is the wrapper for all tasks
gulp.task('default', ['concatScripts', 'concatStyles']);