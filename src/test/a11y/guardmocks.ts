import * as mock from 'mock-require'
import { Claim } from 'claims/models/claim'
import * as express from 'express'
import * as claimStoreMock from 'test/http-mocks/claim-store'

export const justForwardRequestHandler = {
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
