import { FeatureTestSuite } from './featureTestSuite'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import { statementOfMeansWithMandatoryFieldsOnlyData } from 'test/data/entity/responseData'
import { StatementOfMeansPaths } from 'response/paths'
import * as common from './commonMocks'

export class StatementTestSuite extends FeatureTestSuite {

  trainMocks () {
    common.mockIdamService()
    claimStoreMock.resolveRetrieveClaimByExternalId({
      statementOfMeans: {
        ...statementOfMeansWithMandatoryFieldsOnlyData
      }
    }).persist()
    draftStoreMock.resolveFindAllDrafts().persist()
  }

  getRoutablePaths () {
    return Object.values(StatementOfMeansPaths)
  }
}
