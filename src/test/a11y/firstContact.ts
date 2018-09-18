import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import * as common from './commonMocks'

export class FirstContactTestSuite extends FeatureTestSuite {
  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId().persist()
  }

  getRoutablePaths () {
    return [
      ...Object.values(DefendantFirstContactErrorPaths),
      ...Object.values(DefendantFirstContactPaths)
    ].filter(path => path !== DefendantFirstContactPaths.receiptReceiver)
  }
}
