import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { CCJClient } from 'claims/ccjClient'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftCCJService } from 'ccj/draft/draftCCJService'
import { PartyType } from 'app/common/partyType'
import Claim from 'claims/models/claim'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'

function prepareUrls (externalId: string): object {
  return {
    addressUrl: Paths.theirDetailsPage.evaluateUri({ externalId: externalId }),
    dateOfBirthUrl: Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }),
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function renderView (form: Form<Declaration>, req: express.Request, res: express.Response): void {
  const user: User = res.locals.user
  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    details: user.ccjDraft,
    amountToBePaid: user.claim.totalAmount - (user.ccjDraft.paidAmount.amount || 0),
    partyAsCompanyOrOrganisation: isPartyCompanyOrOrganisation(user),
    ...prepareUrls(req.params.externalId)
  })
}

function isPartyCompanyOrOrganisation (user: User): boolean {
  const claim: Claim = user.claim
  const type: string = claim.claimData.claimant.type
  return type === PartyType.COMPANY.value || type === PartyType.ORGANISATION.value
}

function deserializerFunction (value: any): any {
  switch (value.type) {
    case SignatureType.BASIC:
      return Declaration.fromObject(value)
    case SignatureType.QUALIFIED:
      return QualifiedDeclaration.fromObject(value)
    default:
      throw new Error(`Unknown declaration type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (user: User): any {
  if (isPartyCompanyOrOrganisation(user)) {
    return QualifiedDeclaration
  } else {
    return Declaration
  }
}

function signatureTypeFor (user: User): string {
  if (isPartyCompanyOrOrganisation(user)) {
    return SignatureType.QUALIFIED
  } else {
    return SignatureType.BASIC
  }
}

export default express.Router()
  .get(Paths.checkAndSendPage.uri, (req: express.Request, res: express.Response) => {
    const StatementOfTruthClass = getStatementOfTruthClassFor(res.locals.user)
    renderView(new Form(new StatementOfTruthClass()), req, res)
  })
  .post(
    Paths.checkAndSendPage.uri,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<any> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        if (signatureTypeFor(user) === SignatureType.QUALIFIED) {
          user.ccjDraft.qualifiedDeclaration = form.model
        }

        await DraftCCJService.save(res, next)
        await CCJClient.save(user)
        await DraftCCJService.delete(res, next)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
