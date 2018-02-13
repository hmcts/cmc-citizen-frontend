import { cpus } from 'os'
import * as cluster from 'cluster'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('applicationCluster')

export type EntryPoint = () => void

export class ApplicationCluster {
  static execute (applicationEntryPoint: EntryPoint): void {
    if (cluster.isMaster) {
      logger.info(`Master process running on ${process.pid}`)
      const numberOfCores = cpus().length
      this.forkListenerProcesses(numberOfCores)
    } else {
      applicationEntryPoint()
    }
  }

  private static forkListenerProcesses (numberOfCores: number): void {
    for (let i = 0; i < numberOfCores; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`)
    })
  }
}
