const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const homeApi = require('./src/api/homeApi');

const app = express();

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(urlencodedParser);
app.use(express.static(`${__dirname}/src/public`));
app.use('/home', homeApi);


// 设置跨域访问
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

module.exports = app;
