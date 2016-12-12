/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
const URL = require('url');
const querystring = require('querystring');
const http = require('http');
const express = require('express');
const wechat = require('wechat');
const assign = Object.assign;

// parse utils
const parseUrl = (url) => URL.parse(url);
const parseQuery = (objURL) => querystring.parse(objURL.query);
const getReqQuery = (req) => parseQuery(parseUrl(req.url));

// server port
const PORT = process.env.PORT || 1234;
// config
const { Messages, WeChat } = require('../config.json');

module.exports = function startServer({ esclient, search }) {
  const app = express();
  app.use(express.query());

  /**
   * search API
   */
  app.use('/search', async (req, res) => {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

    let query = getReqQuery(req);
    let word = query['q'] || '';

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

  /**
   * 接受的消息
   * 文本消息
   * req.weixin=> {
   *   ToUserName: 'gh_208a8ec77969',
   *   FromUserName: 'oDYR7uOWVr2f50LJoKSNrae4fofM',
   *   CreateTime: '1458611911',
   *   MsgType: 'text',
   *   Content: '消息内容',
   *   MsgId: '6264690455703743275'
   * }
   **/
  app.use('/wechat', wechat(config.wechat, async (req, res) => {

    let { MsgType, Content } = req['weixin'];

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

      let source = result.hits.hits.map(item => assign({}, item._source, item.highlight));

      if (!source.length) {
        throw `none match for ${Content}`;
      } else {
        res.reply(source);
      }
    } catch (e) {
      res.reply(Messages['error']);
      console.error(e);
    }
  }));

  // for what?
  app.use('/login', (req, res) => {
    res.send('OK');
  });

  app.use('/', (req, res) => {
    res.send('<html><head><meta property="qc:admins" content="151131774534167545156375" /><meta http-equiv="refresh" content="1; url=http://weekly.75team.com/"></head><body>正在跳转</body></html>');
  });

  http.createServer(app).listen(PORT);
  console.log(`server listening on port ${PORT}`);
};