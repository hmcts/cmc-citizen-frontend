import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { RoutablePath } from 'shared/router/routablePath'
import * as common from './commonMocks'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import supertest = require('supertest')
import { EventEmitter } from 'events'
import { Pa11yPipeline } from './pa11yPipeline'

export class ClaimIssueTestSuite extends FeatureTestSuite {

  constructor (pa11yPipeline: Pa11yPipeline, eventEmitter: EventEmitter, agentSupplier: () => supertest.SuperTest<supertest.Test>) {
    super(pa11yPipeline, eventEmitter, agentSupplier, '91e1c70f-7d2c-4c1e-0003-cbb02c0e64d6')
  }

  trainMocks () {
    common.mockIdamService()
    common.mockFees()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    const paths: RoutablePath[] = [
      ...Object.values(ClaimIssuePaths),
      ...Object.values(ClaimIssueErrorPaths)
    ]
    const exclusions: RoutablePath[] = [
      ClaimIssuePaths.startPaymentReceiver,
      ClaimIssuePaths.finishPaymentReceiver,
      ClaimIssuePaths.receiptReceiver,
      ClaimIssuePaths.sealedClaimPdfReceiver
    ]
    return paths.filter(path => !exclusions.includes(path))
  }
}
