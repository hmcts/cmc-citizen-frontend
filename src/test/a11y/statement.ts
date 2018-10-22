import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { statementOfMeansWithMandatoryFieldsOnlyData } from 'test/data/entity/responseData'
import { StatementOfMeansPaths } from 'response/paths'
import * as common from './commonMocks'
import { Pa11yPipeline } from './pa11yPipeline'
import { EventEmitter } from 'events'
import supertest = require('supertest')

export class StatementTestSuite extends FeatureTestSuite {

  constructor (pa11yPipeline: Pa11yPipeline, eventEmitter: EventEmitter, agentSupplier: () => supertest.SuperTest<supertest.Test>) {
    super(pa11yPipeline, eventEmitter, agentSupplier, '91e1c70f-7d2c-4c1e-0009-cbb02c0e64d6')
  }

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
      statementOfMeans: {
        ...statementOfMeansWithMandatoryFieldsOnlyData
      }
    }).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(StatementOfMeansPaths)
  }
}
