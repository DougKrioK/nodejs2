var express = require('express');
var consign = require('consign');

module.exports = () => {
    var app = express();
    consign()
        .include('routes')
        .into(app);

    return app
}