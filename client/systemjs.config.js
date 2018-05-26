/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        //defaultJSExtensions: true,
        paths: { 'npm:': '/node_modules/' },
        map: {

            app: '/out',
            'parse-torrent-name': 'npm:parse-torrent-name/index.js',
            'events': 'npm:events/events.js',
            'xmltojson': "npm:xmltojson/lib/xmltojson.js",
            'tmdb': "npm:tmdb/out/index.js",
            'xhr2': "npm:xhr2/lib/browser.js",

            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/router/upgrade': 'npm:@angular/router/bundles/router-upgrade.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
            '@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',

            'rxjs': 'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',

        },
        packages: {
            app: { main: '/main.js', defaultExtension: 'js' },
            rxjs: { main:'index.js', defaultExtension: "js" },
            'rxjs/operators': { main:'index.js', defaultExtension: "js" },
        },
    });
})(this);
