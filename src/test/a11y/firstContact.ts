import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import * as common from './commonMocks'

export class FirstContactTestSuite extends FeatureTestSuite {

  protected uuid = '91e1c70f-7d2c-4c1e-0005-cbb02c0e64d6'

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid).persist()
  }

  getRoutablePaths () {
    return [
      ...Object.values(DefendantFirstContactErrorPaths),
      ...Object.values(DefendantFirstContactPaths)
    ].filter(path => path !== DefendantFirstContactPaths.receiptReceiver)
  }
}
