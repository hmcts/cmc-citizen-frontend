import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { FullAdmissionPaths } from 'response/paths'
import * as common from './commonMocks'

export class FullAdmissionTestSuite extends FeatureTestSuite {
  protected uuid = '91e1c70f-7d2c-4c1e-0006-cbb02c0e64d6'

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(FullAdmissionPaths)
  }

}
