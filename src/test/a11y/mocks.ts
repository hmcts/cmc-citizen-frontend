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
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import * as courtFinderMock from '../http-mocks/court-finder-client'
import { MomentFactory } from 'shared/momentFactory'

idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder').persist()
idamServiceMock.resolveRetrieveServiceToken().persist()

draftStoreMock.resolveFindAllDrafts().persist()

claimStoreMock.resolvePostponedDeadline('2020-01-01').persist()
claimStoreMock.resolveRetrieveByLetterHolderId('100MC000').persist()
claimStoreMock.resolveRetrieveClaimByExternalId({
  respondedAt: '2017-08-07T15:27:34.654',
  claimantRespondedAt: MomentFactory.parse('2017-09-09'),
  response: {
    ...defenceWithDisputeData,
    ...fullAdmissionWithPaymentByInstalmentsData,
    ...partialAdmissionWithPaymentByInstalmentsData,
    statementOfMeans: {
      ...statementOfMeansWithMandatoryFieldsOnlyData
    }
  },
  countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
  countyCourtJudgment: {
    defendantDateOfBirth: '1990-11-01',
    paidAmount: 2,
    paymentOption: 'INSTALMENTS',
    repaymentPlan: {
      instalmentAmount: 30,
      firstPaymentDate: '2018-11-11',
      paymentSchedule: 'EVERY_MONTH',
      completionDate: '2019-11-11',
      paymentLength: '12 months'
    },
    ccjType: CountyCourtJudgmentType.DETERMINATION
  },
  settlementReachedAt: '2017-08-10T15:27:32.917',
  claimantResponse: {
    type: ClaimantResponseType.ACCEPTATION,
    amountPaid: 0
  },
  reDeterminationRequestedAt: '2018-12-01T12:34:56.789'
}).persist()

claimStoreMock.mockCalculateInterestRate(0).persist()
claimStoreMock.resolveRetrieveUserRoles('cmc-new-features-consent-given').persist()
claimStoreMock.mockNextWorkingDay(MomentFactory.parse('2019-01-01')).persist()
feesMock.resolveCalculateIssueFee().persist()
feesMock.resolveCalculateHearingFee().persist()
feesMock.resolveGetIssueFeeRangeGroup().persist()
feesMock.resolveGetHearingFeeRangeGroup().persist()
courtFinderMock.resolveFind().persist()
courtFinderMock.resolveCourtDetails().persist()

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

mock('directions-questionnaire/guard/directionsQuestionnaireGuard', {
  DirectionsQuestionnaireGuard: justForwardRequestHandler
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
