import { Paths as CCJPaths } from 'ccj/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { FeatureTestSuite } from './featureTestSuite'
import * as common from './commonMocks'
import { fullAdmissionWithPaymentByInstalmentsData } from 'test/data/entity/responseData'

export class CCJTestSuite extends FeatureTestSuite {
  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId({
      countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144',
      response: {
        ...fullAdmissionWithPaymentByInstalmentsData
      }
    }).persist()
    claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist()

    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(CCJPaths)
  }
}
