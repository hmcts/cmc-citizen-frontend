import { FeatureTestSuite } from './featureTestSuite'
import { Paths as OfferPaths } from 'offer/paths'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as common from './commonMocks'

export class OfferTestSuite extends FeatureTestSuite {

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId({
      settlementReachedAt: '2017-08-10T15:27:32.917'
    }).persist()
  }

  getRoutablePaths () {
    return Object.values(OfferPaths).filter(path => path !== OfferPaths.agreementReceiver)
  }
}
