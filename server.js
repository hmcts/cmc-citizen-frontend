const { execSync } = require('child_process')
const { StringDecoder } = require('string_decoder')
const output = execSync('pwd')
console.log(`>>> ${new StringDecoder('utf8').write(output)}`)

process.env.TS_NODE_FAST = "true"
require('ts-node/register')
require('./src/main/server')
