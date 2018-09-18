import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import * as common from './commonMocks'
import {
  partialAdmissionWithPaymentByInstalmentsData,
  statementOfMeansWithMandatoryFieldsOnlyData
} from 'test/data/entity/responseData'

export class ClaimantResponseTestSuite extends FeatureTestSuite {
  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId({
      response: {
        ...partialAdmissionWithPaymentByInstalmentsData,
        statementOfMeans: {
          ...statementOfMeansWithMandatoryFieldsOnlyData
        }
      }
    }).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(ClaimantResponsePaths).filter(path => path !== ClaimantResponsePaths.receiptReceiver)
  }
}
