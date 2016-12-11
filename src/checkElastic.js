/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
require('shelljs/global');

// check any elasticsearch process
// under current account/user
module.exports = function checkElastic() {
  let elasticInfo = exec('ps -af', { silent: true }).grep('elasticsearch');
  return !!elasticInfo.trim();
};
