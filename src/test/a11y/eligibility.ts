import { FeatureTestSuite } from './featureTestSuite'
import { RoutablePath } from 'shared/router/routablePath'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as common from './commonMocks'

export class EligibilityTestSuite extends FeatureTestSuite {

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId().persist()
  }

  getRoutablePaths (): RoutablePath[] {
    return Object.values(EligibilityPaths)
  }
}
