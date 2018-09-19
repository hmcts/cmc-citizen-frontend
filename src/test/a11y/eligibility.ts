import { FeatureTestSuite } from './featureTestSuite'
import { RoutablePath } from 'shared/router/routablePath'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as common from './commonMocks'

export class EligibilityTestSuite extends FeatureTestSuite {

  protected uuid = '91e1c70f-7d2c-4c1e-0004-cbb02c0e64d6'

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid).persist()
  }

  getRoutablePaths (): RoutablePath[] {
    return Object.values(EligibilityPaths)
  }
}
