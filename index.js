require("babel-register")({
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-async-to-generator']
});

require("babel-polyfill");

require('./src/index');
