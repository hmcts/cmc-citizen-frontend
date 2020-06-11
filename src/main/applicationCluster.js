"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const cluster = require("cluster");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('applicationCluster');
class ApplicationCluster {
    static execute(applicationEntryPoint) {
        if (cluster.isMaster) {
            logger.info(`Master process running on ${process.pid}`);
            const numberOfCores = os_1.cpus().length;
            this.forkListenerProcesses(numberOfCores);
        }
        else {
            applicationEntryPoint();
        }
    }
    static forkListenerProcesses(numberOfCores) {
        for (let i = 0; i < numberOfCores; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`);
        });
    }
}
exports.ApplicationCluster = ApplicationCluster;
