import { Paths as CCJPaths } from 'ccj/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { FeatureTestSuite } from './featureTestSuite'
import * as common from './commonMocks'
import { fullAdmissionWithPaymentByInstalmentsData } from 'test/data/entity/responseData'
import { RoutablePath } from 'shared/router/routablePath'
import supertest = require('supertest')
import { EventEmitter } from 'events'
import { Pa11yPipeline } from './pa11yPipeline'

export class CCJTestSuite extends FeatureTestSuite {

  constructor (pa11yPipeline: Pa11yPipeline, eventEmitter: EventEmitter, agentSupplier: () => supertest.SuperTest<supertest.Test>) {
    super(pa11yPipeline, eventEmitter, agentSupplier, '91e1c70f-7d2c-4c1e-0001-cbb02c0e64d6')
    console.log(`created CCJTestSuite with uuid ${this.uuid}`)
  }

  trainMocks () {
    common.mockIdamService()
    draftStoreMock.resolveFindAllDrafts().persist()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
      countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144',
      response: {
        ...fullAdmissionWithPaymentByInstalmentsData
      }
    }).persist()
    claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist()
  }

  getRoutablePaths (): RoutablePath[] {
    return Object.values(CCJPaths)
  }
}
