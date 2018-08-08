import * as express from 'express'
import * as mock from 'mock-require'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as feesMock from 'test/http-mocks/fees'
import { Claim } from 'claims/models/claim'

import {
  defenceWithDisputeData,
  fullAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithPaymentByInstalmentsData,
  statementOfMeansWithMandatoryFieldsOnlyData
} from 'test/data/entity/responseData'

idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder').persist()
idamServiceMock.resolveRetrieveServiceToken().persist()

draftStoreMock.resolveFindAllDrafts().persist()

claimStoreMock.resolvePostponedDeadline('2020-01-01').persist()
claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist()
claimStoreMock.resolveRetrieveClaimByExternalId({
  respondedAt: '2017-08-07T15:27:34.654',
  response: {
    ...defenceWithDisputeData,
    ...fullAdmissionWithPaymentByInstalmentsData,
    ...partialAdmissionWithPaymentByInstalmentsData,
    statementOfMeans: {
      ...statementOfMeansWithMandatoryFieldsOnlyData
    }
  },
  countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144',
  settlementReachedAt: '2017-08-10T15:27:32.917'
}).persist()

claimStoreMock.mockCalculateInterestRate(0).persist()
feesMock.resolveCalculateIssueFee().persist()
feesMock.resolveCalculateHearingFee().persist()
feesMock.resolveGetIssueFeeRangeGroup().persist()
feesMock.resolveGetHearingFeeRangeGroup().persist()

const justForwardRequestHandler = {
  requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    next()
  }
}

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
      return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        next()
      }
    },
    createAsync: () => {
      return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        next()
      }
    }
  }
})
