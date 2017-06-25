var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    config = require('./config'),
    server = require('http').createServer(app),
    port = process.env.PORT || 3000;

var flash = require('connect-flash');

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/app/views/pages');
    app.set('view engine', 'ejs');
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        secret: 'secret'
    }));
    app.use(flash());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes/routes')(app);