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

const checkElastic = require('./checkElastic');
const { esclient, search } = require('./esclient');
const startHTTPServer = require('./server');

// ping to check if elastic is ready
const pingPromise = function () {
  return new Promise(function (resolve, reject) {
    esclient.ping({
      requestTimeout: 3000,
      hello: "elasticsearch!"
    }, function (error) {
      if (error) {
        console.error('No elasticsearch cluster ready for use!');
        reject();
      } else {
        console.log('All is well!');
        resolve();
      }
    });
  });
};

// if ping succeeds, start http server
// otherwise, retry after 5s
const start = async function () {
  try {
    await pingPromise();
  } catch (e) {
    console.error(e);
    // retry
    setTimeout(function () {
      start();
    }, 3000);

    return;
  };

  // if ping ok
  // start our server
  priocess.nextTick(function () {
    startHTTPServer({ esclient, search });
  });
};

// if elastic cluster is not running
// start it
if (!checkElastic()) {
  require('./runElastic');
  console.log('elastic starts...');

  // delay 10s 
  setTimeout(start, 10000);
} else {
  start();
}
