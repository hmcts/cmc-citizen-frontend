process.env.TS_NODE_TRANSPILE_ONLY = "true"
require('@hmcts/properties-volume').addTo(require('config'))
require('ts-node/register')
require('./src/main/server')
