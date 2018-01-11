import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { StatementOfTruth } from 'forms/models/statementOfTruth'
import { FeesClient } from 'fees/feesClient'
import { TotalAmount } from 'forms/models/totalAmount'
import { InterestDateType } from 'app/common/interestDateType'
import { claimAmountWithInterest, interestAmount } from 'utils/interestUtils'
import { InterestType } from 'claim/form/models/interest'
import { PartyType } from 'app/common/partyType'
import { AllClaimTasksCompletedGuard } from 'claim/guards/allClaimTasksCompletedGuard'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { PartyDetails } from 'forms/models/partyDetails'
import { User } from 'idam/user'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'

async function getClaimAmountTotal (draft: DraftClaim): Promise<TotalAmount> {
  return FeesClient.calculateIssueFee(await claimAmountWithInterest(draft))
    .then(async (feeAmount: number) => {
      return new TotalAmount(draft.amount.totalAmount(), await interestAmount(draft), feeAmount)
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

function getStatementOfTruthClassFor (draft: Draft<DraftClaim>): { new(): StatementOfTruth | QualifiedStatementOfTruth } {
  if (draft.document.claimant.partyDetails.isBusiness()) {
    return QualifiedStatementOfTruth
  } else {
    return StatementOfTruth
  }
}

function renderView (form: Form<StatementOfTruth>, res: express.Response, next: express.NextFunction) {
  const draft: Draft<DraftClaim> = res.locals.claimDraft

  getClaimAmountTotal(draft.document)
    .then((interestTotal: TotalAmount) => {
      res.render(Paths.checkAndSendPage.associatedView, {
        draftClaim: draft.document,
        claimAmountTotal: interestTotal,
        payAtSubmission: draft.document.interestDate.type === InterestDateType.SUBMISSION,
        interestClaimed: draft.document.interest.type !== InterestType.NO_INTEREST,
        contactPerson: getContactPerson(draft.document.claimant.partyDetails),
        businessName: getBusinessName(draft.document.claimant.partyDetails),
        dateOfBirth: getDateOfBirth(draft.document.claimant.partyDetails),
        defendantBusinessName: getBusinessName(draft.document.defendant.partyDetails),
        partyAsCompanyOrOrganisation: draft.document.claimant.partyDetails.isBusiness(),
        paths: Paths,
        form: form
      })
    }).catch(next)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.checkAndSendPage.uri, AllClaimTasksCompletedGuard.requestHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const StatementOfTruthClass = getStatementOfTruthClassFor(draft)
    renderView(new Form(new StatementOfTruthClass()), res, next)
  })
  .post(Paths.checkAndSendPage.uri,
    AllClaimTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruth | QualifiedStatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        if (form.model.type === SignatureType.QUALIFIED) {
          const draft: Draft<DraftClaim> = res.locals.claimDraft
          const user: User = res.locals.user

          draft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await new DraftService().save(draft, user.bearerToken)
        }
        res.redirect(Paths.startPaymentReceiver.uri)
      }
    })
