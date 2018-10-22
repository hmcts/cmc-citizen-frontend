import { FeatureTestSuite } from './featureTestSuite'
import { Paths as OfferPaths } from 'offer/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as common from './commonMocks'
import supertest = require('supertest')
import { EventEmitter } from 'events'
import { Pa11yPipeline } from './pa11yPipeline'

export class OfferTestSuite extends FeatureTestSuite {

  constructor (pa11yPipeline: Pa11yPipeline, eventEmitter: EventEmitter, agentSupplier: () => supertest.SuperTest<supertest.Test>) {
    super(pa11yPipeline, eventEmitter, agentSupplier, '91e1c70f-7d2c-4c1e-0007-cbb02c0e64d6')
  }

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
      settlementReachedAt: '2017-08-10T15:27:32.917'
    }).persist()
  }

  getRoutablePaths () {
    return Object.values(OfferPaths).filter(path => path !== OfferPaths.agreementReceiver)
  }
}
