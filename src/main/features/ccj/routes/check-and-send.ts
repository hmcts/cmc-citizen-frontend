import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { CCJClient } from 'claims/ccjClient'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'
import { plainToClass } from 'class-transformer'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyType } from 'app/common/partyType'
import { Party } from 'claims/models/details/yours/party'
import { DraftService } from 'services/draftService'

function prepareUrls (externalId: string): object {
  return {
    dateOfBirthUrl: Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }),
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function convertToPartyDetails (party: Party): PartyDetails {
  return plainToClass(PartyDetails, party)
}

function renderView (form: Form<Declaration>, req: express.Request, res: express.Response): void {
  const user: User = res.locals.user

  const defendant = convertToPartyDetails(user.claim.claimData.defendant)
  if (defendant.type === PartyType.INDIVIDUAL.value) {
    (defendant as IndividualDetails).dateOfBirth = user.ccjDraft.document.defendantDateOfBirth
  }

  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    claim: user.claim,
    draft: user.ccjDraft.document,
    defendant: defendant,
    amountToBePaid: user.claim.totalAmountTillToday - (user.ccjDraft.document.paidAmount.amount || 0),
    ...prepareUrls(req.params.externalId)
  })
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

function getStatementOfTruthClassFor (user: User): { new(): Declaration | QualifiedDeclaration } {
  if (user.claim.claimData.claimant.isBusiness()) {
    return QualifiedDeclaration
  } else {
    return Declaration
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.checkAndSendPage.uri, (req: express.Request, res: express.Response) => {
    const StatementOfTruthClass = getStatementOfTruthClassFor(res.locals.user)
    renderView(new Form(new StatementOfTruthClass()), req, res)
  })
  .post(
    Paths.checkAndSendPage.uri,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration | QualifiedDeclaration> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        if (form.model.type === SignatureType.QUALIFIED) {
          user.ccjDraft.document.qualifiedDeclaration = form.model as QualifiedDeclaration
          await new DraftService().save(user.ccjDraft, user.bearerToken)
        }

        await CCJClient.save(user)
        await new DraftService().delete(user.ccjDraft.id, user.bearerToken)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
