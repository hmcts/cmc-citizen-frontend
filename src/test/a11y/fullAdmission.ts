import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { FullAdmissionPaths } from 'response/paths'
import * as common from './commonMocks'

export class FullAdmissionTestSuite extends FeatureTestSuite {

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId().persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(FullAdmissionPaths)
  }
}
