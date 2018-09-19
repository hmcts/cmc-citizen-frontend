import { FeatureTestSuite } from './featureTestSuite'
import { Paths as DefendantResponsePaths } from 'response/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import {
  defenceWithDisputeData,
  fullAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithPaymentByInstalmentsData,
  statementOfMeansWithMandatoryFieldsOnlyData
} from 'test/data/entity/responseData'
import { RoutablePath } from 'shared/router/routablePath'
import * as common from './commonMocks'

export class ResponseTestSuite extends FeatureTestSuite {

  protected uuid = '91e1c70f-7d2c-4c1e-0008-cbb02c0e64d6'

  trainMocks () {
    common.mockIdamService()
    common.mockFees()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
      respondedAt: '2017-08-07T15:27:34.654',
      response: {
        ...defenceWithDisputeData,
        ...fullAdmissionWithPaymentByInstalmentsData,
        ...partialAdmissionWithPaymentByInstalmentsData,
        statementOfMeans: {
          ...statementOfMeansWithMandatoryFieldsOnlyData
        }
      },
      directionsQuestionnaireDeadline: '2010-10-10',
      countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144',
      settlementReachedAt: '2017-08-10T15:27:32.917'
    }).persist()
    claimStoreMock.resolvePostponedDeadline('2020-01-01').persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    const paths: RoutablePath[] = Object.values(DefendantResponsePaths)
    const exclusions: RoutablePath[] = [
      DefendantResponsePaths.receiptReceiver,
      DefendantResponsePaths.legacyDashboardRedirect
    ]
    return paths.filter(path => !exclusions.includes(path))
  }
}
