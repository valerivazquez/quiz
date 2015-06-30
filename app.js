var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require ('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded()); // Lo hemos sustituido por el anterior para que funcionen los pseudo JSON en los formularios
app.use(cookieParser('Quiz Valeri'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos
app.use(function(req, res, next){

    // guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    

    // auto-logout despues de 2 min de inactividad http
    if (req.session.user){ // esta logado
       if(req.session.fecha){ // y tiene fecha de ultima actividad http
           var varNow = new Date();
           var varBefore = new Date(req.session.fecha);
           var varDif = (varNow.getTime() - varBefore.getTime())/60000;
           if (varDif > 2){ // Mas de dos minutos de inactividad http
            //  res.redirect("/logout");
              delete req.session.user;
              delete req.session.fecha; 
            } else {
                req.session.fecha = new Date();
            }
        }else req.session.fecha = new Date();
    }
    next();

});

app.use('/', routes);

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
