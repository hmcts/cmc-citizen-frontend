import * as express from 'express'
import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import StatementOfTruthCompany from 'forms/models/statementOfTruthCompany'
import FeesClient from 'fees/feesClient'
import ClaimAmountTotal from 'forms/models/claimInterestTotal'
import InterestDateType from 'app/common/interestDateType'
import { claimAmountWithInterest, interestAmount } from 'utils/interestUtils'
import { InterestType } from 'forms/models/interest'
import { PartyType } from 'app/common/partyType'
import AllClaimTasksCompletedGuard from 'claim/guards/allClaimTasksCompletedGuard'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { PartyDetails } from 'forms/models/partyDetails'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

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

function getContactPerson (partyDetails: PartyDetails): string {
  if (partyDetails.type === PartyType.COMPANY.value) {
    return (partyDetails as CompanyDetails).contactPerson
  } else if (partyDetails.type === PartyType.ORGANISATION.value) {
    return (partyDetails as OrganisationDetails).contactPerson
  } else {
    return undefined
  }
}

function isCompanyOrOrganisation (partyDetails: PartyDetails): boolean {
  return partyDetails.type === PartyType.COMPANY.value || partyDetails.type === PartyType.ORGANISATION.value
}

function renderView (form: Form<StatementOfTruthCompany>, res: express.Response, next: express.NextFunction) {
  getClaimAmountTotal(res)
    .then((claimAmountTotal: ClaimAmountTotal) => {
      res.render(Paths.checkAndSendPage.associatedView, {
        draftClaim: res.locals.user.claimDraft,
        claimAmountTotal: claimAmountTotal,
        payAtSubmission: res.locals.user.claimDraft.interestDate.type === InterestDateType.SUBMISSION,
        interestClaimed: (res.locals.user.claimDraft.interest.type !== InterestType.NO_INTEREST),
        contactPerson: getContactPerson(res.locals.user.claimDraft.claimant.partyDetails),
        businessName: getBusinessName(res.locals.user.claimDraft.claimant.partyDetails),
        defendantBusinessName: getBusinessName(res.locals.user.claimDraft.defendant.partyDetails),
        partyAsCompanyOrOrganisation: isCompanyOrOrganisation(res.locals.user.claimDraft.claimant.partyDetails),
        form: form
      })
    }).catch(next)
}

export default express.Router()
  .get(Paths.checkAndSendCompanyPage.uri, AllClaimTasksCompletedGuard.requestHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statementOfTruth = new StatementOfTruthCompany()
    renderView(new Form(statementOfTruth), res, next)
  })
  .post(Paths.checkAndSendCompanyPage.uri, AllClaimTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(StatementOfTruthCompany, StatementOfTruthCompany.fromObject),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruthCompany> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.locals.user.claimDraft.statementOfTruth = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.startPaymentReceiver.uri)
      }
    })
