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

  protected uuid = '91e1c70f-7d2c-4c1e-0002-cbb02c0e64d6'

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByFixedExternalId(this.uuid, {
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
