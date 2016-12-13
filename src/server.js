/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
const URL = require('url');
const querystring = require('querystring');
const http = require('http');

const express = require('express');
const wechat  = require('wechat');

const wechatMiddle = process.env.ENV !== 'development' ? wechat : function (config, handler) {
  return function (req, res, next) {
    req.weixin = {
      ToUserName: 'gh_208a8ec77969',
      FromUserName: 'oDYR7uOWVr2f50LJoKSNrae4fofM',
      CreateTime: '1458611911',
      MsgType: 'text',
      Content: '前端工程',
      MsgId: '6264690455703743275'
    };

    res.reply = function (source) {
      res.end(JSON.stringify(source));
    };
    handler(req, res, next);
  };
};

// elastic-jdbc indexing
const runJDBC = require('./runJDBC');

// Object.assign
const assign = Object.assign;
// parse utils
const parseUrl = (url) => URL.parse(url);
const parseQuery = (objURL) => querystring.parse(objURL.query);
const getReqQuery = (req) => parseQuery(parseUrl(req.url));

// server port
const PORT = process.env.PORT || 1234;

// config
const {
  Messages,
  WeChat
} = require('../config.json');

module.exports = function startServer({
  esclient,
  search
}) {

  // random color
  const colors = ["f44336", "e91e63", "9c27b0", "673ab7", "3f51b5", "2196f3", "03a9f4", "00bcd4", "009688", "4caf50", "8bc34a", "cddc39", "ffeb3b", "ffc107", "ff9800", "ff5722", "795548", "9e9e9e", "607d8b"];

  // get random color
  const randColor = () => colors[~~(Math.random() * colors.length)];

  // get heading image url
  const getImage = (query) => `http://placeholdit.imgix.net/~text?txtsize=50&txt=${encodeURIComponent(query)}&w=450&h=250&bg=${randColor()}&txtclr=ffffff`;

  const app = express();

  app.use(express.query());

  /**
   * search API
   */
  app.use('/search', async(req, res) => {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

    let query = getReqQuery(req);
    let word = query['q'] || '';

    console.log(word);

    try {
      let result = await search({
        word,
        size: 50
      });

      let source = result.hits.hits.map(item => assign({}, item._source, item.highlight));
      res.end(JSON.stringify(source));

    } catch (e) {
      res.end('[]');
      console.error(e);
    }
  });

  /*
  req.weixin => {
    ToUserName: 'gh_208a8ec77969',
    FromUserName: 'oDYR7uOWVr2f50LJoKSNrae4fofM',
    CreateTime: '1458611911',
    MsgType: 'text',
    Content: '消息内容',
    MsgId: '6264690455703743275'
  }*/
  app.use('/wechat', wechatMiddle(WeChat, async(req, res) => {
    let {
      MsgType,
      Content
    } = req['weixin'];

    console.log(Content);

    // if not text message
    if (MsgType !== 'text') {
      res.reply(Messages['default']);
      return;
    }

    // TODO
    // we should limit valid number to latest index
    // if valid number
    if (/^\d+$/.test(Content)) {
      res.reply([{
        title: `奇舞周刊第${ Content }期`,
        description: '',
        picurl: 'http://p7.qhimg.com/d/inn/f4e17557/0.jpg',
        url: `http://75team.com/weekly/issue${ Content }.html`
      }]);
      return;
    }

    try {

      let result = await search({
        size: 5,
        word: Content
      });

      let source = result.hits.hits.map(item => ({
        title: item._source.title,
        url: item._source.url,
      }));

      if (!source.length) {
        throw `none match for ${Content}`;
      } else {

        source[0].picurl = getImage(Content);
        source.push({
          title: '戳我查看更多搜索结果...',
          url: 'http://weekly.75team.com/search.html?#' + Content
        });

        res.reply(source);
      }
    } catch (e) {
      res.reply(Messages['error']);
      console.error(e);
    }
  }));

  // do JDBC indexing
  app.use('/jdbcindexing', (req, res) => {
    runJDBC();
    res.end('start running JDBC indexing...please wait....');
  });

  app.use('/', (req, res) => {
    res.send('<html><head><meta property="qc:admins" content="151131774534167545156375" /><meta http-equiv="refresh" content="1; url=http://weekly.75team.com/"></head><body>正在跳转</body></html>');
  });

  http.createServer(app).listen(PORT);
  console.log(`server listening on port ${PORT}`);
};
