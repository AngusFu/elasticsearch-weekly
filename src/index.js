/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 * 
 * references:
 * http://blog.csdn.net/jam00/article/details/52984382
 * http://es.xiaoleilu.com/
 * https://imququ.com/post/elasticsearch.html
 */

'use strict';

const { esclient, search } = require('./esclient');
const startHTTPServer = require('./server');

// run elastic
require('./runElastic')();
// start server
startHTTPServer({ esclient, search });
