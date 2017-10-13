import * as express from 'express'
import * as mock from 'mock-require'

import * as idamServiceMock from '../http-mocks/idam'
import * as draftStoreMock from '../http-mocks/draft-store'
import * as claimStoreMock from '../http-mocks/claim-store'
import * as feesMock from '../http-mocks/fees'

idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'letter-holder', 'claimant', 'defendant').persist()
idamServiceMock.resolveRetrieveServiceToken().persist()

draftStoreMock.resolveFindAllDrafts().persist()

claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist()
claimStoreMock.resolveRetrieveClaimByExternalId({
  respondedAt: '2017-08-07T15:27:34.654',
  countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144'
}).persist()

feesMock.resolveCalculateIssueFee().persist()
feesMock.resolveCalculateHearingFee().persist()
feesMock.resolveGetIssueFeeRangeGroup().persist()
feesMock.resolveGetHearingFeeRangeGroup().persist()

const justForwardRequestHandler = {
  requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    next()
  }
}

mock('response/guards/alreadyRespondedGuard', {
  AlreadyRespondedGuard: justForwardRequestHandler
})

mock('claim/guards/allClaimTasksCompletedGuard', {
  'default': justForwardRequestHandler
})

mock('response/guards/moreTimeAlreadyRequestedGuard', {
  'default': justForwardRequestHandler
})

mock('response/guards/moreTimeRequestRequiredGuard', {
  'default': justForwardRequestHandler
})

mock('response/guards/oweNoneResponseRequiredGuard', {
  'default': justForwardRequestHandler
})

mock('response/guards/countyCourtJudgmentRequestedGuard', {
  'CountyCourtJudgmentRequestedGuard': justForwardRequestHandler
})

mock('response/guards/allResponseTasksCompletedGuard', {
  'default': justForwardRequestHandler
})

mock('ccj/guards/ccjGuard', {
  'CCJGuard': justForwardRequestHandler
})

mock('ccj/guards/individualDateOfBirthGuard', {
  'IndividualDateOfBirthGuard': justForwardRequestHandler
})

mock('response/guards/guardFactory', {
  GuardFactory: {
    create: () => {
      return justForwardRequestHandler.requestHandler
    }
  }
})
