var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { v4: uuidv4 } = require('uuid');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/db.db');

var indexRouter = require('./routes/index');
// var productsRouter = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api/products', productsRouter);
app.use('/', indexRouter);
app.post('/api/products', function(req, res) {
    let id = uuidv4();
    let name = req.body.name;
    let type = req.body.type;
    let price = req.body.price;
    let sku = type + '-' + name + '-' + id;
    let stmt = db.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?)");
    stmt.run(id, name, type, price, sku)
    stmt.finalize()
    db.close()
    res.json(sku)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
