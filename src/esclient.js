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
exports.search = async function ({ word = '', size = 50, from = 0 }) {
  let res = await esclient.search({
    index: DB_NAME,
    type: "article",
    body: {
      from,
      size,
      query: {
        bool :{
          should: [{
            match: { title: query }
          }, {
            bool: {
              should: [{
                match: {
                  description: query
                }
              }, {
                match: {
                  tags: query
                }
              }]
            }
          }]   
        }
      },
      highlight: {
        pre_tags: ['<em>'],
        post_tags: ['</em>'],
        require_field_match: true,
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
