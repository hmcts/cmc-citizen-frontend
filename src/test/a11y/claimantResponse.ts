import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import * as common from './commonMocks'
import {
  partialAdmissionWithPaymentByInstalmentsData,
  statementOfMeansWithMandatoryFieldsOnlyData
} from 'test/data/entity/responseData'
import supertest = require('supertest')
import { EventEmitter } from 'events'
import { Pa11yPipeline } from './pa11yPipeline'

export class ClaimantResponseTestSuite extends FeatureTestSuite {

  constructor (pa11yPipeline: Pa11yPipeline, eventEmitter: EventEmitter, agentSupplier: () => supertest.SuperTest<supertest.Test>) {
    super(pa11yPipeline, eventEmitter, agentSupplier, '91e1c70f-7d2c-4c1e-0002-cbb02c0e64d6')
  }

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
      response: {
        ...partialAdmissionWithPaymentByInstalmentsData,
        statementOfMeans: {
          ...statementOfMeansWithMandatoryFieldsOnlyData
        }
      }
    }).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(ClaimantResponsePaths)
      .filter(path => path !== ClaimantResponsePaths.receiptReceiver)
      .filter(path => path !== ClaimantResponsePaths.courtOfferedSetDatePage)
  }
}
