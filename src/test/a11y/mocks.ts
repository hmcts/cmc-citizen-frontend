import * as express from 'express'
import * as mock from 'mock-require'

import * as idamServiceMock from '../http-mocks/idam'
import * as draftStoreMock from '../http-mocks/draft-store'
import * as claimStoreMock from '../http-mocks/claim-store'
import * as feesMock from '../http-mocks/fees'
import { Claim } from 'claims/models/claim'

idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'letter-holder').persist()
idamServiceMock.resolveRetrieveServiceToken().persist()

draftStoreMock.resolveFindAllDrafts().persist()

claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist()
claimStoreMock.resolveRetrieveClaimByExternalId({
  respondedAt: '2017-08-07T15:27:34.654',
  countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144'
}).persist()

claimStoreMock.mockCalculateInterestRate(1).persist()

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

mock('first-contact/guards/claimReferenceMatchesGuard', {
  ClaimReferenceMatchesGuard: {
    requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.claim = new Claim().deserialize(claimStoreMock.sampleClaimObj)
      next()
    }
  }
})

mock('claim/guards/allClaimTasksCompletedGuard', {
  AllClaimTasksCompletedGuard: justForwardRequestHandler
})

mock('response/guards/moreTimeAlreadyRequestedGuard', {
  MoreTimeAlreadyRequestedGuard: justForwardRequestHandler
})

mock('response/guards/moreTimeRequestRequiredGuard', {
  MoreTimeRequestRequiredGuard: justForwardRequestHandler
})

mock('response/guards/oweNoneResponseRequiredGuard', {
  OweNoneResponseRequiredGuard: justForwardRequestHandler
})

mock('response/guards/countyCourtJudgmentRequestedGuard', {
  CountyCourtJudgmentRequestedGuard: justForwardRequestHandler
})

mock('response/guards/allResponseTasksCompletedGuard', {
  AllResponseTasksCompletedGuard: justForwardRequestHandler
})

mock('ccj/guards/ccjGuard', {
  CCJGuard: justForwardRequestHandler
})

mock('offer/guards/offerGuard', {
  OfferGuard: justForwardRequestHandler
})

mock('response/guards/guardFactory', {
  GuardFactory: {
    create: () => {
      return justForwardRequestHandler.requestHandler
    }
  }
})
