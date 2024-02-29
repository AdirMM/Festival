const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'))
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano'); //Comprime css
const postcss = require('gulp-postcss'); // Transformaciones usando los 2 anteriores
const sourcemaps = require('gulp-sourcemaps');


function css( done ) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
    .pipe( sourcemaps.init() )
    .pipe( plumber() )
    .pipe( sass() ) // Compilarlo
    .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('build/css') ); //Almacenarla en el disco duro

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}

//*Imagenes

// Optimizar imagenes

function imagenes( done ) {
    const imagemin = require( 'gulp-imagemin');
    const cache = require('gulp-cache');

    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ))
        .pipe( dest('build/img') )
    done();
}

// Conversion de imagenes a webp

function versionWebp( done ) {

    const webp = require("gulp-webp");

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )

    done();
}

// Conversion de imagenes a avif

function versionAvif( done ) {
   const avif = require('gulp-avif'); 

    const opciones = {
        quality: 50
    }

    src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ))
        .pipe( dest('build/img') )

    done();
}


//* Javascript
const terser = require('gulp-terser-js');

function javascript ( done ) {

  src('src/js/**/*.js')
    .pipe( sourcemaps.init() )
    .pipe( terser() )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('build/js'));

  done ();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( css, versionWebp, versionAvif, javascript, dev );