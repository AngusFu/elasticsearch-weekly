/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
require('shelljs/global');

// check any elasticsearch process running
module.exports = function checkElastic() {
  let elasticInfo = exec('ps -af', { silent: true }).grep('elasticsearch-');
  console.log('' + elasticInfo);
  return !!elasticInfo.trim();
};
