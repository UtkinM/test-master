'use strict';

var gulp = require('gulp'),

    jade = require('gulp-jade'),

    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),

    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require("gulp.spritesmith"),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    svg2string = require('gulp-svg2string'),

    watch = require('gulp-watch'),
    inject = require('gulp-inject'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync').create(),
    runSequence = require('gulp-run-sequence'),
    clean = require('gulp-clean');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        jade: 'src/jade/*.jade',
        js: [
			'src/js/vendor/jquery-2.1.4.min.js',
			'src/js/svg.js',
			'src/js/my_scripts/include-svg.js',
			'src/js/my_scripts/control-menu-tabs.js',
			'src/js/my_scripts/promo-slider.js',
			'src/js/my_scripts/search-mobile-control.js',
			'src/js/my_scripts/app.js'
        ],
        style: 'src/scss/**/main.scss',
        img: 'src/images/**/*.*',
        pngSprite: 'src/sprite/png/**/*.png',
        svgSprite: 'src/sprite/svg/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        jade: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.{scss}',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        pngSprite: 'src/sprite/png/**/*.png',
        svgSprite: 'src/sprite/svg/**/*.svg'
    },

    clean: {
        build: 'build',
        prod: ['build/css/maps', 'build/js/maps']
    }
};

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('jade:build', function () {
    gulp.src(path.src.jade)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(jade({ pretty: '\t'}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    var processors = [
        autoprefixer({browsers: ['last 3 version']}),
        cssnano(),
        require('css-mqpacker')({sort: true}),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty'),
        require('postcss-discard-overridden'),
        require('postcss-discard-unused'),
        require('postcss-merge-idents'),
        require('postcss-merge-longhand'),
        require('postcss-merge-rules')
    ];

    gulp.src(path.src.style)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss(processors))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('main.js'))
        .pipe(uglify({ preserveComments: 'license'}))
        // .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

// PNG Sprites
gulp.task('png-sprite:build', function () {
    var spriteData =
        gulp.src(path.src.pngSprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_png-sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                cssTemplate: 'sass.template.mustache',
                cssVarMap: function (sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('src/images/'));
    spriteData.css.pipe(gulp.dest('src/scss/'));
});

// SVG Sprites
gulp.task('svg-sprite:build', function () {
    var svgs = gulp
        .src(path.src.svgSprite)
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(svg2string())
        .pipe(gulp.dest('src/js'))
});




gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

// таск для очистки кеша Gulp, использовать если возникнут проблемы с изображениями или другими кешируемыми файлами
gulp.task('clear-cache', function () {
    return cache.clearAll();
});

gulp.task('clean:build', function () {
    return gulp.src(path.clean.build, {read: false})
        .pipe(clean());
});

gulp.task('clean:prod', function () {
    return gulp.src(path.clean.prod, {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    watch([path.watch.jade], function (event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.pngSprite], function (event, cb) {
        gulp.start(['png-sprite:build']);
    });
    watch([path.watch.svgSprite], function (event, cb) {
        gulp.start('svg-sprite:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('build', function(cb) {
    runSequence('clean:build', [
        'jade:build',
        'js:build',
        'style:build',
        'fonts:build',
        'png-sprite:build',
        'svg-sprite:build',
        'image:build',
        'browser-sync'
    ], 'watch', cb);
});
