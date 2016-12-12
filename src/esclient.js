/**
 * @authhor  angusfu1126@qq.com
 * @date     2016-12-10
 */

'use strict';
const { DB_NAME } = require('../config.json');
const elasticsearch = require('elasticsearch');

// create es client
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

exports.esclient = esclient;

// search function
// @see http://es.xiaoleilu.com/110_Multi_Field_Search/20_Tuning_best_field_queries.html
exports.search = async function (word) {
  let res = await esclient.search({
    index: DB_NAME,
    type: "article",
    size: 100,
    body: {
      query: {
        dis_max: {
          queries: [
            {
              match: {
                title: word
              }
            },
            {
              match: {
                description: word
              }
            },
            {
              match: {
                tags: word
              }
            }
          ],
          tie_breaker: 0.3
        }
      },
      highlight: {
        pre_tags: ['<em>'],
        post_tags: ['</em>'],
        fields: {
          title: {},
          description: {},
          tags: {}
        }
      }
    }
  });

  return res;
};
