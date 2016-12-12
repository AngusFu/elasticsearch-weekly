/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
const path = require('path');
const execFile = require('child_process').execFile;

const { ES_ROOT } = require('../config.json');
const elastic = execFile(path.resolve(__dirname, `../${ES_ROOT}/bin/elasticsearch`));

elastic.stdout.on('data', (data) => {
  console.log(data);
});

elastic.stderr.on('data', (data) => {
  console.error(data);
});

elastic.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
