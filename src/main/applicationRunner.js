"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const https = require("https");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('applicationRunner');
class ApplicationRunner {
    static run(app) {
        const port = ApplicationRunner.applicationPort();
        if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
            const server = https.createServer(ApplicationRunner.getSSLOptions(), app);
            server.listen(port, () => {
                logger.info(`Listener started (PID ${process.pid}): https://localhost:${port}`);
            });
        }
        else {
            app.listen(port, () => {
                logger.info(`Listener started (PID ${process.pid}): http://localhost:${port}`);
            });
        }
    }
    static getSSLOptions() {
        const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
        return {
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
        };
    }
    /**
     * Return type is string because Azure PaaS communicates with the application
     * through a named pipe and not a TCP port.
     */
    static applicationPort() {
        const defaultPort = '3000';
        let port = process.env.PORT;
        if (port === undefined) {
            logger.info(`Port value was not set using PORT env variable, using the default of ${defaultPort}`);
            port = defaultPort;
        }
        return port;
    }
}
exports.ApplicationRunner = ApplicationRunner;
