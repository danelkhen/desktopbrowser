/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        defaultJSExtensions: true,
        paths: { 'npm:': '/node_modules/' },
        map: {
            app: '/out',
            'parse-torrent-name': 'npm:parse-torrent-name/index.js',
            'events': 'npm:events/events.js',
            'xmltojson': "npm:xmltojson/lib/xmltojson.js",
        },
        packages: {
            app: { main: '/main.js', defaultExtension: 'js' },
        }
    });
})(this);
