const http = require('node:http')

// Mocha's node-option spawns a child process. Run this there, rather than only
// while reading .mocharc.js in the parent, so Supertest never reuses old sockets.
http.globalAgent = new http.Agent({ keepAlive: false })
