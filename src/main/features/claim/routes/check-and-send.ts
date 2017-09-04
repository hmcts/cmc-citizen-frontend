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
import { PartyType } from 'forms/models/partyType'
import AllClaimTasksCompletedGuard from 'claim/guards/allClaimTasksCompletedGuard'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyDetails } from 'forms/models/partyDetails'

function getClaimAmountTotal (res: express.Response): Promise<ClaimAmountTotal> {
  return FeesClient.calculateIssueFee(claimAmountWithInterest(res.locals.user.claimDraft))
    .then((feeAmount: number) => {
      return new ClaimAmountTotal(res.locals.user.claimDraft.amount.totalAmount(), interestAmount(res.locals.user.claimDraft), feeAmount)
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
  } else if (partyDetails.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
    return (partyDetails as SoleTraderDetails).dateOfBirth
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

function renderView (form: Form<StatementOfTruth>, res: express.Response, next: express.NextFunction) {
  getClaimAmountTotal(res)
    .then((claimAmountTotal: ClaimAmountTotal) => {
      res.render(Paths.checkAndSendPage.associatedView, {
        draftClaim: res.locals.user.claimDraft,
        claimAmountTotal: claimAmountTotal,
        payAtSubmission: res.locals.user.claimDraft.interestDate.type === InterestDateType.SUBMISSION,
        interestClaimed: (res.locals.user.claimDraft.interest.type !== InterestType.NO_INTEREST),
        contactPerson: getContactPerson(res.locals.user.claimDraft.claimant.partyDetails),
        businessName: getBusinessName(res.locals.user.claimDraft.claimant.partyDetails),
        dateOfBirth : getDateOfBirth(res.locals.user.claimDraft.claimant.partyDetails),
        defendantContactPerson: getContactPerson(res.locals.user.claimDraft.defendant.partyDetails),
        defendantBusinessName: getBusinessName(res.locals.user.claimDraft.defendant.partyDetails),
        form: form
      })
    }).catch(next)
}

export default express.Router()
  .get(Paths.checkAndSendPage.uri, AllClaimTasksCompletedGuard.requestHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(Form.empty<StatementOfTruth>(), res, next)
  })
  .post(Paths.checkAndSendPage.uri, AllClaimTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(StatementOfTruth, StatementOfTruth.fromObject),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.redirect(Paths.startPaymentReceiver.uri)
      }
    })
