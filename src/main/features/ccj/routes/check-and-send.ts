import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { CCJClient } from 'claims/ccjClient'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { SignatureType } from 'common/signatureType'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'
import { plainToClass } from 'class-transformer'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyType } from 'common/partyType'
import { Party } from 'claims/models/details/yours/party'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Claim } from 'claims/models/claim'
import {
  CCJModelConverter, getRepaymentPlanForm,
  retrievePaymentOptionsFromClaim
} from 'claims/ccjModelConverter'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { LocalDate } from 'forms/models/localDate'
import * as CCJHelper from 'main/common/helpers/ccjHelper'

function prepareUrls (externalId: string, claim: Claim, draft: Draft<DraftCCJ>): object {
  if (claim.response && claim.isAdmissionsResponse()) {
    if (draft.document.paymentOption.option !== PaymentType.INSTALMENTS) {
      return {
        paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
        paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
      }
    } else {
      return {
        paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId })
      }
    }
  }
  return {
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    dateOfBirthUrl: Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function convertToPartyDetails (party: Party): PartyDetails {
  return plainToClass(PartyDetails, party)
}

function retrieveAndSetDateOfBirthIntoDraft (claim: Claim, draft: Draft<DraftCCJ>): Draft<DraftCCJ> {
  const dateOfBirthFromResponse: DateOfBirth = claim.retrieveDateOfBirthOfDefendant
  if (dateOfBirthFromResponse) {
    draft.document.defendantDateOfBirth = dateOfBirthFromResponse
  }
  return draft
}

function renderView (form: Form<Declaration>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let draft: Draft<DraftCCJ> = res.locals.ccjDraft
  const defendant = convertToPartyDetails(claim.claimData.defendant)

  draft = retrieveAndSetDateOfBirthIntoDraft(claim, draft)

  draft = retrieveAndSetValuesInDraft(claim, draft)

  if (defendant.type === PartyType.INDIVIDUAL.value) {
    (defendant as IndividualDetails).dateOfBirth = draft.document.defendantDateOfBirth
  }

  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    claim: claim,
    draft: draft.document,
    defendant: defendant,
    amountToBePaid: calculateAmountToBePaid(claim, draft),
    ...prepareUrls(req.params.externalId, claim, draft)
  })
}

function calculateAmountToBePaid (claim: Claim, draft: Draft<DraftCCJ>): number {
  if (CCJHelper.isPartAdmissionAcceptation(claim)) {
    return CCJHelper.amountSettledFor(claim) - (draft.document.paidAmount.amount || 0) + CCJHelper.claimFeeInPennies(claim) / 100
  }

  return claim.totalAmountTillToday - (draft.document.paidAmount.amount || 0)
}

function retrieveAndSetValuesInDraft (claim: Claim, draft: Draft<DraftCCJ>): Draft<DraftCCJ> {
  const paymentOption: CCJPaymentOption = retrievePaymentOptionsFromClaim(claim)
  if (paymentOption) {
    draft.document.paymentOption = paymentOption
    if (paymentOption !== undefined && paymentOption.option.value === PaymentOption.INSTALMENTS) {
      draft.document.repaymentPlan = getRepaymentPlanForm(claim, draft)
    } else if (paymentOption !== undefined && paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
      draft.document.payBySetDate = new PaymentDate(LocalDate.fromMoment(claim.settlement.getLastOffer().paymentIntention.paymentDate))
    }
  }
  return draft
}

function deserializerFunction (value: any): Declaration | QualifiedDeclaration {
  switch (value.type) {
    case SignatureType.BASIC:
      return Declaration.fromObject(value)
    case SignatureType.QUALIFIED:
      return QualifiedDeclaration.fromObject(value)
    default:
      throw new Error(`Unknown declaration type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (claim: Claim): { new (): Declaration | QualifiedDeclaration } {
  if (claim.claimData.claimant.isBusiness()) {
    return QualifiedDeclaration
  } else {
    return Declaration
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.checkAndSendPage.uri, (req: express.Request, res: express.Response) => {
    const claim: Claim = res.locals.claim
    const StatementOfTruthClass = getStatementOfTruthClassFor(claim)
    renderView(new Form(new StatementOfTruthClass()), req, res)
  })
  .post(
    Paths.checkAndSendPage.uri,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration | QualifiedDeclaration> = req.body

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        const claim: Claim = res.locals.claim
        let draft: Draft<DraftCCJ> = res.locals.ccjDraft

        draft = retrieveAndSetValuesInDraft(claim, draft)

        draft = retrieveAndSetDateOfBirthIntoDraft(claim, draft)

        const user: User = res.locals.user

        if (form.model.type === SignatureType.QUALIFIED) {
          draft.document.qualifiedDeclaration = form.model as QualifiedDeclaration
          await new DraftService().save(draft, user.bearerToken)
        }
        const countyCourtJudgment = CCJModelConverter.convertForRequest(draft.document, claim)
        await CCJClient.request(claim.externalId, countyCourtJudgment, user)
        await new DraftService().delete(draft.id, user.bearerToken)
        res.redirect(Paths.ccjConfirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
