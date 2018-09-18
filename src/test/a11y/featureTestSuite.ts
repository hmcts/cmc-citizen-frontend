import { Pa11yPipeline } from './pa11yPipeline'
import { EventEmitter } from 'events'
import { SuperTest, Test } from 'supertest'
import { RoutablePath } from 'shared/router/routablePath'
import { Pa11yTest } from './pa11yTest'

export abstract class FeatureTestSuite {

  public constructor (
    protected readonly pa11yPipeline: Pa11yPipeline,
    protected readonly eventEmitter: EventEmitter,
    protected readonly agentSupplier: () => SuperTest<Test>
  ) {
  }

  abstract trainMocks ()

  abstract getRoutablePaths (): RoutablePath[]

  enqueue () {
    this.getRoutablePaths().forEach(path => {
      const uri: string = path.uri.includes(':externalId')
        ? path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6' })
        : path.uri
      this.pa11yPipeline.add(new Pa11yTest(uri, this.eventEmitter, this.agentSupplier, this.trainMocks))
    })
  }
}
