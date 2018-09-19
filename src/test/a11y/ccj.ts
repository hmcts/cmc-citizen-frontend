import { Paths as CCJPaths } from 'ccj/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { FeatureTestSuite } from './featureTestSuite'
import * as common from './commonMocks'
import { fullAdmissionWithPaymentByInstalmentsData } from 'test/data/entity/responseData'

export class CCJTestSuite extends FeatureTestSuite {
  protected uuid: string = '91e1c70f-7d2c-4c1e-0001-cbb02c0e64d6'

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

  getRoutablePaths () {
    return Object.values(CCJPaths)
  }
}
