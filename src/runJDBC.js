/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
require('shelljs/global');
// const checkElastic = require('./checkElastic');

const path = require('path')
const { JDBC_ROOT } = require('../config.json');
const LIB = path.resolve(__dirname, `../${JDBC_ROOT}/lib`);
const BIN = path.resolve(__dirname, `../${JDBC_ROOT}/bin`);
const CONFIG = require('./jdbc');

let isRunning = false;

module.exports = function runJDBC() {
  // just once at the same time
  if (isRunning) {
    return;
  }

  let child = echo(JSON.stringify(CONFIG)).exec(`
    java -cp "${LIB}/*" -Dlog4j.configurationFile=${BIN}/log4j2.xml org.xbib.tools.Runner org.xbib.tools.JDBCImporter
  `, { async: true });

  isRunning = true;

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    isRunning = false;
    console.log(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    isRunning = false;
    if (code === 0) {
      console.log('JDBC DONE!!!');
    } else {
      console.error('Something WRONG when JDBC indexing.....');
    }
    console.log(`child process exited with code ${code}`);
  });
};
