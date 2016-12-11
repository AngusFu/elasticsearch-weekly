/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
const URL = require('url');
const querystring = require('querystring');
const http = require('http');
const assign = Object.assign;

// parse utils
const parseUrl = (url) => URL.parse(url);
const parseQuery = (objURL) => querystring.parse(objURL.query);
const getReqQuery = (req) => parseQuery(parseUrl(req.url));

// server port
const PORT = 1234;

module.exports = function startServer({ esclient, search }) {

  // TODO
  // run jdbc again
  let server = http.createServer(async function (req, res) {

    res.writeHead(200, { 'Content-Type': 'application/json' });

    let query = getReqQuery(req);
    let word = query['search'] || '';

    try {
      let result = await search(word);
      let source = result//.hits.hits.map(item => assign({}, item._source, item.highlight));
      res.end(JSON.stringify(source));
    } catch (e) {
      res.end('[]');
      console.error(e);
    }
  });

  server.listen(PORT);

  console.log(`server listening on port ${PORT}`);
};
