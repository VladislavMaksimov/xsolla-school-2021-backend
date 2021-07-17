var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { v4: uuidv4 } = require('uuid');
const { callbackify } = require('util');
const { resolve } = require('path');
var sqlite3 = require('sqlite3').verbose();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Products' });
});

app.get('/api/products', function(req, res) {
    let stmt = 'SELECT id, name, type, price, sku FROM products';
    let products = [];
    let db = new sqlite3.Database('./db/db.db');
    db.serialize(function(){
      db.all(stmt, function(err, rows) {
        if (err) {
          throw err;
        };
        rows.forEach(function(row) {
          products.push({
            id: row.id,
            name: row.name,
            type: row.type,
            price: row.price,
            sku: row.sku
          });
        });
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
      });
    });
    db.close();
});

app.post('/api/products', function(req, res) {
  let id = uuidv4();
  let name = req.body.name;
  let type = req.body.type;
  let price = req.body.price;
  let sku = type + '-' + name + '-' + id;
  let db = new sqlite3.Database('./db/db.db');
  let stmt = db.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?)");
  stmt.run(id, name, type, price, sku);
  stmt.finalize();
  db.close();
  res.json(sku);
});

app.get('/api/products/:id', function(req, res) {
  let id = req.params.id;
  let stmt = `SELECT id, name, type, price, sku FROM products WHERE id = "${id}" OR sku = "${id}"`;
  let db = new sqlite3.Database('./db/db.db');
  db.serialize(function() {
    db.all(stmt, function(err, rows) {
      if (err) {
        throw err;
      };
      let row = rows[0];
      let product = {
        id: row.id,
        name: row.name,
        type: row.type,
        price: row.price,
        sku: row.sku
      };
      res.setHeader('Content-Type', 'application/json');
      res.json(product);
    });
  });
  db.close();
});

app.delete('/api/products/:id', function(req, res) {
  let id = req.params.id;
  let db = new sqlite3.Database('./db/db.db');
  let stmt = db.prepare("DELETE FROM products WHERE id = ? OR sku = ?");
  stmt.run(id,id);
  stmt.finalize();
  db.close();
  res.status(200);
  res.send();
});

app.put('/api/products/:id', function(req, res) {
  let id = req.params.id;
  let name = req.body.name;
  let type = req.body.type;
  let price = req.body.price;
  let newSku = type + '-' + name + '-' + id.split('-').slice(2).join('-');
  let db = new sqlite3.Database('./db/db.db');

  let cb = function(sku) {
    let newSku = type + '-' + name + '-' + sku.split('-').slice(2).join('-');
    let stmtUpdate = db.prepare("UPDATE products SET name = ?, type = ?, price = ?, sku = ? WHERE id = ? OR sku = ?");
    stmtUpdate.run(name, type, price, newSku, id, id);
    stmtUpdate.finalize();
    res.json(newSku);
  };

  let stmtSelect = `SELECT sku FROM products WHERE id = "${id}" OR sku = "${id}"`
  db.all(stmtSelect, function(err, rows) {
    if (err) {
      throw err;
    };
    let sku = rows[0].sku;
    return cb(sku);
  });
  
  db.close();
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
