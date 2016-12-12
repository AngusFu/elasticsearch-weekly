
const {
  DB_NAME,
  DB_USER,
  DB_PWD
} = require('../config.json');

module.exports = {
  "type": "jdbc",
  "jdbc": {
    "url": `jdbc:mysql://localhost:3306/${DB_NAME}?autoReconnect=true&useSSL=false`,
    "user": DB_USER,
    "password":DB_PWD,
    "sql": "select *, aid as _id from article where status=1",
    "index": DB_NAME,
    "type": "article",
    "index_settings": {
      "analysis": {
        "analyzer": {
          "ik": {
            "tokenizer": "ik"
          }
        }
      }
    },
    "type_mapping": {
      "article": {
        "properties": {
          "aid": {
            "type": "integer",
            "index": "not_analyzed"
          },
          "iid": {
            "type": "integer",
            "index" : "not_analyzed"
          },
          "title": {
            "type": "string",
            "analyzer": "ik_smart"
          },
          "url": {
            "type": "string",
            "index" : "not_analyzed"
          },
          "description": {
            "type": "string",
            "analyzer": "ik_smart"
          },
          "tags": {
            "type": "string",
            "analyzer": "ik_smart"
          },
          "status": {
            "type": "integer",
            "index" : "not_analyzed"
          },
          "provider": {
            "type": "string",
            "index" : "not_analyzed"
          }
        }
      }
    },
    "elasticsearch": {
      "cluster": "elasticsearch",
      "host": "localhost",
      "port": "9300"
    }
  }
};

