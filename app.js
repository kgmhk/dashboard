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

import index from './routes/index';


let dbconfig = require(__dirname+'/config/database.json');
// 주석 ---
let connection = mysql.createPool(dbconfig);
// ----
// import favicon from 'serve-favicon';


const app = express();

// session setting
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  proxy: true
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
  console.log('first fucntion');
  let pathname = parseurl(req).pathname.split("?");

  console.log('pathname  ::', pathname);
  if (pathname[0] === '/dbs/accounts') {
    console.log('pathname : ', pathname);
    console.log('req.session : ', req.query.id);
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
        console.log('destroy()');
        res.send(true);
      }
    });  // 세션 삭제
  } else {
    console.log('after destroy');
    res.send(false);
  }
});

app.get('/products', (req, res, next) => {
  // res.render('products', {account_id: 11});
    console.log('/products req.session : ', req.session.user_id);
    if (!req.session.user_id) {
      res.render('login');
    } else {

      res.render('products', {user_id: req.session.user_id});
    }
});

app.get('/management', (req, res) => {
    if (!req.session.user_id) {
      res.render('login');
    } else {

      res.render('management');
    }
});

/**
 * db query
 */

app.get('/dbs/products', async(req, res) => {

  console.log('GET /dbs/products', );

  // 주 석 ----

  const rows = await connection.query("SELECT *, count(size) as count FROM shoes_table as shoes join brand_table as brand " +
    "WHERE shoes.code = brand.code Group by shoes.size, shoes.code order by brand.id");
  let products = rows;

  console.log('products: ', products);
  let sizeArray = [130,140,150,160,170,180,190,200,210,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300];

  let shoesInfo = {};
  sizeArray.forEach(size => {
    products.forEach(product => {
      if (shoesInfo[product.code]) {
        if (!shoesInfo[product.code][size] && product.size === size) {
          shoesInfo[product.code][size] = product.count;
        } else if (!shoesInfo[product.code][size]) {
          // shoesInfo[product.code][size] = 0;
        }
      } else {
        shoesInfo[product.code] = {
          code: product.code,
          color: product.color,
          inputPrice: product.input_price,
          outputPrice: product.output_price,
          brand: product.brand_name
        };

        shoesInfo[product.code][product.size] = product.count

      }
    })
  });
  let data = _.map(shoesInfo, shoe => {
    return shoe;
  });

  res.send(data);
});


app.get('/dbs/accounts', (req, res, next) => {
  // 주석 ---
  console.log('req.session.query 11: ', req.session.user_id);
    let id = req.query.id;
    let pw = req.query.pw;
    console.log('req.query', req.query);

    connection.query(`SELECT * FROM account_table WHERE account_id = "${id}" AND account_pw = "${pw}"`, (err, rows) => {
        if(err) {
          console.log('err : ', err);
          throw err;
        }

        if (rows.length === 0) {
          req.session.destroy(function (err) {
            if (err) console.log('err : ', err);
            else {
              console.log('destroy()');
              res.send(false);
            }
          });

        } else {
          console.log('req.session.query : ', req.session.user_id);
          res.send(true);
        }
    });
  // ----
});

async function asyncTest() {
  return new Promise((resolve) => setTimeout(resolve, 3000))
}

app.post('/dbs/products', async(req, res) => {
  let code = req.body.code;
  let color = req.body.color;
  let inputPrice = req.body.inputPrice;
  let outputPrice = req.body.outputPrice;
  let brand = req.body.brand;
  let size = req.body.size;
  
  
  
  console.log(`${code}, ${color}, ${inputPrice}, ${outputPrice}, ${brand}, ${size}`);

  // await asyncTest();

  console.log('next');

  const insertColor = await connection.query('INSERT INTO `color_table`(`color`) VALUES ("'+color+'")').catch(err => {
    console.log(err);
    if (err.errno !== 1062) throw err;
  });

  console.log('duplicatedColor : ', insertColor);

  const insertBrand = await connection.query('INSERT INTO `brand_table`(`code`, `brand_name`) VALUES ("'+code+'", "'+brand+'")').catch(err => {
    console.log(err);
    if (err.errno !== 1062) throw err;
  });

  console.log('insertBrand', insertBrand);

  const insertShoes = await connection.query('INSERT INTO `shoes_table`(`code`, `size`, `input_price`, `output_price`, `color`) VALUES ("'+code+'","'+size+'", "'+inputPrice+'", "'+outputPrice+'", "'+color+'")').catch(err => {
    console.log(err);
    if (err.errno !== 1062) throw err;
    else res.send('duplicated shoes');
  })

  console.log('complieted insert shoes');
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
