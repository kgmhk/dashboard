import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import mysql from 'promise-mysql';
import _ from 'lodash';
import session from 'express-session';
import parseurl from 'parseurl';
let RedisStore = require('connect-redis')(session);

import index from './routes/index';
import { ProductsProcessor } from './routes/processor/products.processor';
import { AccountProcessor } from './routes/processor/account.processor';
import { ColorProcessor } from './routes/processor/color.processor';
import { BrandProcessor } from './routes/processor/brand.processor';
import { ClientProcessor } from './routes/processor/client.processor';

let dbconfig = require(__dirname+'/config/database.json');
// 주석 ---
let connection = mysql.createPool(dbconfig);
// ----
// import favicon from 'serve-favicon';

const productsProcessor = new ProductsProcessor();
const accountProcessor = new AccountProcessor();
const colorProcessor = new ColorProcessor();
const brandProcessor = new BrandProcessor();
const clientProcessor = new ClientProcessor();
const app = express();

app.use(cookieParser());
// session setting
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  proxy: true,
  store   : new RedisStore({
    host: 'localhost',
    port: 6379,
  })
}));

const debug = Debug('dashboard:app');
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

app.use(function (req, res, next) {
  let pathname = parseurl(req).pathname.split("?");
  if (pathname[0] === '/dbs/accounts') {
    let user_id = req.query.id;
    req.session.user_id = user_id;
    console.log('input user_id  : ', req.session.user_id);
    next();
  } else {
    console.log('else user_id  : ', req.session.user_id);
    next();
  }
});


app.get('/login', (req, res, next) => {
    console.log('get login');
    res.render('login');
});

app.get('/logout', (req, res, next) => {
  console.log('get logout', req.session.user_id);

  if (req.session.user_id) {
    req.session.destroy(function (err) {
      if (err) console.log('err : ', err);
      else {
        res.send(true);
      }
    });  // 세션 삭제
  } else {
    res.send(false);
  }
});

app.get('/list/products/inventory', (req, res, next) => {
  // res.render('products', {account_id: 11});
    console.log('/products req.session : ', req.session.user_id);
    if (!req.session.user_id) {
      res.render('login');
    } else {

      res.render('products', {user_id: req.session.user_id});
    }
});

app.get('/apply/products/add', (req, res, next) => {
    if (!req.session.user_id) {
      res.render('login');
    } else {

      res.render('add_product', {user_id: req.session.user_id});
    }
});

app.get('/apply/products/sold', (req, res, next) => {
  if (!req.session.user_id) {
    res.render('login');
  } else {

    res.render('sold_product', {user_id: req.session.user_id});
  }
});

app.get('/apply/products/etc', (req, res, next) => {
  if (!req.session.user_id) {
    res.render('login');
  } else {

    res.render('add_color_brand', {user_id: req.session.user_id});
  }
});

app.get('/list/products/sold', (req, res, next) => {
  if (!req.session.user_id) {
    res.render('login');
  } else {

    res.render('sold_products_list', {user_id: req.session.user_id});
  }
});

/**
 * db query
 */

app.get('/dbs/products', async(req, res) => {
  console.log('GET /dbs/products', );
  const data = await productsProcessor.getProducts();
  res.send(data);
});

app.get('/dbs/list/products/sold', async(req, res) => {
  console.log('GET /dbs/products', );
  const data = await productsProcessor.getSoldProducts();
  // const data = [{code: 111, color: "white", inputPrice: 10000, outputPrice: 20000, brand: "nike", size: 130, date: "2017-01-01"}];
  res.send(data);
});

app.get('/dbs/list/colors', async(req, res) => {
  console.log('GET /dbs/list/color', );
  const data = await colorProcessor.getColor();
  // const data = [{code: 111, color: "white"}];
  res.send(data);
});

app.get('/dbs/list/brands', async(req, res) => {
  console.log('GET /dbs/list/brands', );
  const data = await brandProcessor.getBrand();
  // const data = [{code: 111, color: "white"}];
  res.send(data);
});

app.get('/dbs/list/clients', async(req, res) => {
  console.log('GET /dbs/list/clients', );
  const data = await clientProcessor.getClient();
  // const data = [{code: 111, color: "white"}];
  res.send(data);
});


app.get('/dbs/accounts', async(req, res, next) => {
  const id = req.query.id;
  const pw = req.query.pw;
  console.log('req.query', req.query);

  const data = await accountProcessor.getAccount(id, pw);

  if (!data) {
    req.session.destroy(function (err) {
      if (err) {
        console.log('err : ', err);
        throw err;
      }
      else {
        console.log('destroy()');
        res.send(data);
      }
    });
  } else {
    res.send(data);
  }
});

async function asyncTest() {
  return new Promise((resolve) => setTimeout(resolve, 3000))
}

app.post('/dbs/product', async(req, res) => {
  const code = req.body.code;
  const color = req.body.color;
  const inputPrice = req.body.inputPrice;
  const outputPrice = req.body.outputPrice;
  const brand = req.body.brand;
  const size = req.body.size;
  const client = req.body.client;

  console.log(`${code}, ${color}, ${inputPrice}, ${outputPrice}, ${brand}, ${size}, ${client}`);

  const result = await productsProcessor.createProduct(code, color, inputPrice, outputPrice, brand, size, client);
  res.send(result);

  console.log('complieted insert shoes');
});

app.post('/dbs/product/barcode', async(req, res) => {
  const barcode = req.body.barcode;

  console.log(`${barcode}`);

  const result = await productsProcessor.createProductByBarcode(barcode);
  res.send(result);

  console.log('complieted insert shoes');
});

app.post('/dbs/sold/barcode', async(req, res) => {
  const barcode = req.body.barcode;

  console.log(`${barcode}`);

  const result = await productsProcessor.soldProductByBarCode(barcode);
  res.send(result);

  console.log('complieted insert shoes');
});

app.post('/dbs/sold', async(req, res) => {
  const code = req.body.code;
  const color = req.body.color;
  const size = req.body.size;

  console.log(`${code}, ${color}, ${size}`);

  const result = await productsProcessor.soldProduct(code, color, size);
  res.send(result);

  console.log('complieted sold shoes');
});

app.post('/dbs/color', async(req, res) => {
  const color = req.body.color;

  console.log(`color : ${color}`);

  const result = await colorProcessor.addColor(color);
  res.send(result);

  console.log('complieted add color');
});

app.post('/dbs/brand', async(req, res) => {
  const brand = req.body.brand;

  console.log(`brand : ${brand}`);

  const result = await brandProcessor.addBrand(brand);
  res.send(result);

  console.log('complieted add brand');
});

app.post('/dbs/client', async(req, res) => {
  const client = req.body.client;

  console.log(`client : ${client}`);

  const result = await clientProcessor.addClient(client);
  res.send(result);

  console.log('complieted add client');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
