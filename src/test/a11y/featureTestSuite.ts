import { Pa11yPipeline } from './pa11yPipeline'
import { EventEmitter } from 'events'
import { SuperTest, Test } from 'supertest'
import { RoutablePath } from 'shared/router/routablePath'
import { Pa11yTest } from './pa11yTest'

export abstract class FeatureTestSuite {
  protected readonly pa11yPipeline: Pa11yPipeline
  protected readonly eventEmitter: EventEmitter
  protected readonly agentSupplier: () => SuperTest<Test>
  protected readonly uuid: string

  protected constructor (
    pa11yPipeline: Pa11yPipeline,
    eventEmitter: EventEmitter,
    agentSupplier: () => SuperTest<Test>,
    uuid: string
  ) {
    this.pa11yPipeline = pa11yPipeline
    this.eventEmitter = eventEmitter
    this.agentSupplier = agentSupplier
    this.uuid = uuid
  }

  abstract trainMocks ()

  abstract getRoutablePaths (): RoutablePath[]

  enqueue () {
    this.getRoutablePaths().forEach(path => {
      const uri: string = path.uri.includes(':externalId')
        ? path.evaluateUri({ externalId: this.uuid })
        : path.uri
      this.pa11yPipeline.add(new Pa11yTest(uri, this.eventEmitter, this.agentSupplier, () => this.trainMocks()))
    })
  }
}
