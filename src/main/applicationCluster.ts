import { cpus } from 'os'
import * as cluster from 'cluster'

const logger = require('@hmcts/nodejs-logging').getLogger('applicationCluster')

export class ApplicationCluster {
  static execute (applicationEntryPoint: () => void): void {
    if (cluster.isMaster) {
      logger.info(`Master process running on ${process.pid}`)
      const numberOfCores = cpus().length
      this.forkListenerProcesses(numberOfCores)
    } else {
      applicationEntryPoint()
    }
  }

  private static forkListenerProcesses (numberOfCores: number) {
    for (let i = 0; i < numberOfCores; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`)
    })
  }
}
