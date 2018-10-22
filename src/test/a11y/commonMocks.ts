import * as idamServiceMock from 'test/http-mocks/idam'
import * as feesMock from 'test/http-mocks/fees'

export function mockIdamService () {
  idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder').persist()
  idamServiceMock.resolveRetrieveServiceToken().persist()
}

export function mockFees () {
  feesMock.resolveGetHearingFeeRangeGroup().persist()
  feesMock.resolveCalculateIssueFee().persist()
  feesMock.resolveCalculateHearingFee().persist()
  feesMock.resolveGetIssueFeeRangeGroup().persist()
}
