import * as express from 'express'
import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import StatementOfTruth from 'forms/models/statementOfTruth'
import FeesClient from 'fees/feesClient'
import ClaimAmountTotal from 'forms/models/claimInterestTotal'
import InterestDateType from 'app/common/interestDateType'
import { claimAmountWithInterest, interestAmount } from 'utils/interestUtils'
import { InterestType } from 'forms/models/interest'
import { PartyType } from 'app/common/partyType'
import AllClaimTasksCompletedGuard from 'claim/guards/allClaimTasksCompletedGuard'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyDetails } from 'forms/models/partyDetails'
import User from 'idam/user'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { DraftService } from 'common/draft/draftService'

function getClaimAmountTotal (res: express.Response): Promise<ClaimAmountTotal> {
  return FeesClient.calculateIssueFee(claimAmountWithInterest(res.locals.user.claimDraft.document))
    .then((feeAmount: number) => {
      return new ClaimAmountTotal(res.locals.user.claimDraft.document.amount.totalAmount(), interestAmount(res.locals.user.claimDraft.document), feeAmount)
    })
}

function getBusinessName (partyDetails: PartyDetails): string {
  if (partyDetails.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
    return (partyDetails as SoleTraderDetails).businessName
  } else {
    return undefined
  }
}

function getDateOfBirth (partyDetails: PartyDetails): DateOfBirth {
  if (partyDetails.type === PartyType.INDIVIDUAL.value) {
    return (partyDetails as IndividualDetails).dateOfBirth
  } else {
    return undefined
  }
}

function getContactPerson (partyDetails: PartyDetails): string {
  if (partyDetails.type === PartyType.COMPANY.value) {
    return (partyDetails as CompanyDetails).contactPerson
  } else if (partyDetails.type === PartyType.ORGANISATION.value) {
    return (partyDetails as OrganisationDetails).contactPerson
  } else {
    return undefined
  }
}

function deserializerFunction (value: any): StatementOfTruth | QualifiedStatementOfTruth {
  switch (value.type) {
    case SignatureType.BASIC:
      return StatementOfTruth.fromObject(value)
    case SignatureType.QUALIFIED:
      return QualifiedStatementOfTruth.fromObject(value)
    default:
      throw new Error(`Unknown statement of truth type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (user: User): { new(): StatementOfTruth | QualifiedStatementOfTruth } {
  if (user.claimDraft.document.claimant.partyDetails.isBusiness()) {
    return QualifiedStatementOfTruth
  } else {
    return StatementOfTruth
  }
}

function renderView (form: Form<StatementOfTruth>, res: express.Response, next: express.NextFunction) {
  const user: User = res.locals.user
  getClaimAmountTotal(res)
    .then((claimAmountTotal: ClaimAmountTotal) => {
      res.render(Paths.checkAndSendPage.associatedView, {
        draftClaim: res.locals.user.claimDraft.document,
        claimAmountTotal: claimAmountTotal,
        payAtSubmission: res.locals.user.claimDraft.document.interestDate.type === InterestDateType.SUBMISSION,
        interestClaimed: (res.locals.user.claimDraft.document.interest.type !== InterestType.NO_INTEREST),
        contactPerson: getContactPerson(res.locals.user.claimDraft.document.claimant.partyDetails),
        businessName: getBusinessName(res.locals.user.claimDraft.document.claimant.partyDetails),
        dateOfBirth: getDateOfBirth(res.locals.user.claimDraft.document.claimant.partyDetails),
        defendantBusinessName: getBusinessName(res.locals.user.claimDraft.document.defendant.partyDetails),
        partyAsCompanyOrOrganisation: user.claimDraft.document.claimant.partyDetails.isBusiness(),
        form: form
      })
    }).catch(next)
}

export default express.Router()
  .get(Paths.checkAndSendPage.uri, AllClaimTasksCompletedGuard.requestHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user
    const StatementOfTruthClass = getStatementOfTruthClassFor(user)
    renderView(new Form(new StatementOfTruthClass()), res, next)
  })
  .post(Paths.checkAndSendPage.uri,
    AllClaimTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      const form: Form<StatementOfTruth | QualifiedStatementOfTruth> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        if (form.model.type === SignatureType.QUALIFIED) {
          user.claimDraft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await DraftService.save(user.claimDraft, user.bearerToken)
        }
        res.redirect(Paths.startPaymentReceiver.uri)
      }
    })
