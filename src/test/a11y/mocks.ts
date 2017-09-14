import * as express from 'express'
import * as mock from 'mock-require'
import DraftClaim from 'drafts/models/draftClaim'
import Claim from 'claims/models/claim'
import ClaimData from 'claims/models/claimData'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'response/form/models/response'
import { FreeMediation } from 'response/form/models/freeMediation'
import { DefendantResponse } from 'app/claims/models/defendantResponse'
import { DefendantResponseData } from 'app/claims/models/defendantResponseData'
import ServiceAuthToken from 'app/idam/serviceAuthToken'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import Email from 'app/forms/models/email'
import * as moment from 'moment'
import { LocalDate } from 'app/forms/models/localDate'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import InterestDate from 'app/claims/models/interestDate'
import InterestDateType from 'app/common/interestDateType'
import Interest, { InterestType } from 'app/forms/models/interest'
import { Defendant, Defendant as DraftDefendant } from 'app/drafts/models/defendant'
import { TheirDetails } from 'app/claims/models/details/theirs/theirDetails'
import { Company as CompanyDetails } from 'app/claims/models/details/theirs/company'
import { Individual } from 'app/claims/models/details/yours/individual'
import { default as DraftClaimant } from 'app/drafts/models/claimant'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Address } from 'claims/models/address'
import { RangeGroup } from 'fees/models/rangeGroup'
import { DraftCCJ } from 'ccj/draft/DraftCCJ'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { PartyDetails } from 'forms/models/partyDetails'

function mockedDraftClaim () {
  let draft = new DraftClaim()
  draft.readResolveDispute = true
  draft.claimant = new DraftClaimant()
  let individualClaimant: IndividualDetails = draft.claimant.partyDetails = new IndividualDetails()
  individualClaimant.dateOfBirth = new DateOfBirth(true, new LocalDate(1980, 1, 1))
  individualClaimant.name = 'John Smith'
  draft.claimant.partyDetails = new PartyDetails()
  draft.claimant.partyDetails.address.postcode = 'postcode'
  draft.claimant.partyDetails.address.line1 = 'line1'
  draft.claimant.mobilePhone = new MobilePhone('07873738765')

  draft.defendant = new DraftDefendant()
  let individualDefendant: IndividualDetails = draft.defendant.partyDetails = new IndividualDetails()
  draft.defendant.email = new Email('defendant@hmcts.com')
  individualDefendant.address.postcode = 'postcode'
  individualDefendant.address.line1 = 'line1'
  individualDefendant.dateOfBirth = new DateOfBirth(true, new LocalDate(1980, 1, 1))
  draft.defendant.mobilePhone = new MobilePhone('07873738765')
  draft.defendant.partyDetails = new PartyDetails()
  draft.defendant.partyDetails.address.postcode = 'postcode'
  draft.defendant.partyDetails.address.line1 = 'line1'
  draft.interestDate.date = new LocalDate(2017, 7, 21)

  return draft
}

function mockedResponseDraft () {
  const draft = new ResponseDraft()
  draft.response = new Response(undefined)
  draft.freeMediation = new FreeMediation()
  draft.defendantDetails = new DraftDefendant()
  let individualDefendant: IndividualDetails = draft.defendantDetails.partyDetails = new IndividualDetails()
  draft.defendantDetails.email = new Email('defendant@hmcts.com')
  individualDefendant.name = 'Pa11y Super Awesome-Tests'
  individualDefendant.dateOfBirth = new DateOfBirth(true, new LocalDate(1980, 1, 1))
  individualDefendant.address.postcode = 'postcode'
  individualDefendant.address.line1 = 'line1'

  draft.moreTimeNeeded = new MoreTimeNeeded(MoreTimeNeededOption.YES)
  return draft
}

function mockedClaim () {
  let claim = new Claim()
  claim.claimData = new ClaimData()
  const companyDetails = new CompanyDetails()
  companyDetails.address = new Address()
  claim.claimData.defendants = [companyDetails]
  claim.claimData.claimant = new Individual()
  claim.claimData.interest = mockedInterest()
  claim.claimData.interestDate = mockedInterestDate()
  claim.claimNumber = 'NNDD-NNDD'
  claim.externalId = 'uuid'
  claim.responseDeadline = moment()
  claim.createdAt = moment()
  return claim
}

function mockedInterest () {
  return new Interest().deserialize({
    type: InterestType.NO_INTEREST
  })
}

function mockedInterestDate () {
  return new InterestDate().deserialize({
    type: InterestDateType.SUBMISSION
  })
}

function mockedDefendantResponse () {
  let response = new DefendantResponse()
  response.response = new DefendantResponseData()
  response.respondedAt = moment()
  response.defendantDetails = new TheirDetails()
  response.defendantDetails.address = new Address()
  response.defendantDetails.address.postcode = 'postcode'
  response.defendantDetails.address.line1 = 'line1'
  response.defendantDetails.email = 'example@example.com'

  return response
}

function mockUser () {
  return { id: 123, roles: ['citizen', 'letter-holder'] }
}

function mockCCJDraft (): DraftCCJ {
  const ccjDraft: DraftCCJ = new DraftCCJ()
  ccjDraft.paidAmount = new PaidAmount(PaidAmountOption.YES, 10)
  const defendant = new Defendant()
  defendant.partyDetails = new IndividualDetails()
  ccjDraft.defendant = defendant
  return ccjDraft
}

const justForwardRequestHandler = {
  requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    next()
  }
}

mock('idam/authorizationMiddleware', {
  AuthorizationMiddleware: {
    requestHandler: () => {
      return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.locals.user = mockUser()
        next()
      }
    }
  }
})

mock('claim/draft/claimDraftMiddleware', {
  'ClaimDraftMiddleware': {
    retrieve: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user = {
        claimDraft: mockedDraftClaim()
      }
      next()
    }
  }
})

mock('claims/retrieveClaimMiddleware', {
  'default': (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.locals.user = {
      claim: mockedClaim()
    }
    next()
  }
})

mock('idam/idamClient', {
  'default': {
    retrieveUserFor: (jwtToken) => mockUser(),
    retrieveServiceToken: () => Promise.resolve(new ServiceAuthToken('token'))
  }
})

mock('claims/claimStoreClient', {
  'default': {
    retrieve: (userId) => mockedClaim(),
    retrieveByClaimantId: (claimantId) => [mockedClaim()],
    retrieveByLetterHolderId: (letterHolderId) => mockedClaim(),
    retrieveLatestClaimByDefendantId: (defendantId) => mockedClaim(),
    retrieveByDefendantId: (defendantId) => [mockedClaim()],
    retrieveByExternalId: (externalId) => mockedClaim(),
    retrieveResponse: (defendantId, claimId) => mockedDefendantResponse()
  }
})

mock('fees/feesClient', {
  'default': {
    calculateIssueFee: (amount) => Promise.resolve(100),
    calculateHearingFee: (amount) => Promise.resolve(50),
    getIssueFeeRangeGroup: () => Promise.resolve(new RangeGroup('IF', 'Issue fee', [])),
    getHearingFeeRangeGroup: () => Promise.resolve(new RangeGroup('HF', 'Hearing fee', []))
  }
})

mock('response/draft/responseDraftMiddleware', {
  'ResponseDraftMiddleware': {
    retrieve: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user = {
        responseDraft: mockedResponseDraft()
      }
      next()
    }
  }
})

mock('response/guards/alreadyRespondedGuard', {
  AlreadyRespondedGuard: justForwardRequestHandler
})

mock('claim/guards/allClaimTasksCompletedGuard', {
  'default': justForwardRequestHandler
})

mock('first-contact/guards/claimReferenceMatchesGuard', {
  'default': {
    requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user.claim = mockedClaim()
      next()
    }
  }
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

mock('response/guards/allResponseTasksCompletedGuard', {
  'default': {
    requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user.claim = mockedClaim()
      next()
    }
  }
})

mock('app/claims/claimMiddleware', {
  'ClaimMiddleware': {
    retrieveByExternalId: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user.claim = mockedClaim()
      next()
    }
  }
})

mock('ccj/guards/ccjGuard', {
  'CCJGuard': {
    requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      next()
    }
  }
})

mock('ccj/guards/individualDateOfBirthGuard', {
  'IndividualDateOfBirthGuard': {
    requestHandler: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      next()
    }
  }
})

mock('ccj/draft/DraftCCJService', {
  'DraftCCJService': {
    retrieve: (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.locals.user[`ccjDraft`] = mockCCJDraft()
      next()
    }
  }
})
