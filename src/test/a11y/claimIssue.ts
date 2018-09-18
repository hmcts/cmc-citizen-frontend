import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { RoutablePath } from 'shared/router/routablePath'
import * as common from './commonMocks'
import * as draftStoreMock from 'test/http-mocks/draft-store'

export class ClaimIssueTestSuite extends FeatureTestSuite {
  trainMocks () {
    common.mockIdamService()
    common.mockFees()
    claimStoreMock.resolveRetrieveClaimByExternalId().persist()
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
