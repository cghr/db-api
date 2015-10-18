var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbCache = require('./dao/dbCache')



var rest = require('./rest');
var requireConfig = {
    isha: ['reports', 'dashboard'],
    cod_anand: ['reports', 'dashboard', 'charts']
}

var ishaReports = require('./isha/reports');
var codAnandReports = require('./cod_anand/reports');

var ishaDashboard = require('./isha/dashboard')
var codAnandDashboard = require('./cod_anand/dashboard')

var codAnandCharts = require('./cod_anand/charts')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rest);

app.use('/isha/report', ishaReports)
app.use('/cod_anand/report', codAnandReports)

app.use('/isha/dashboard', ishaDashboard)
app.use('/cod_anand/dashboard', codAnandDashboard)

app.use('/cod_anand/charts', codAnandCharts)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;