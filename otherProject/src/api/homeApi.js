const express = require('express');
const url = require('url');
const { restResult } = require('../model/result');
const { readFileData } = require('../utils');

const router = express.Router();

router.get('/test', async (req, res) => {
  const { query } = url.parse(req.url, true);
  const fileData = await readFileData('articles/20181227101530.MD');
  const result = restResult(200, fileData);
  console.log(query);
  res.json(result);
});

module.exports = router;
