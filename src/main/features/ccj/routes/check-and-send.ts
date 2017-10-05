import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { CCJClient } from 'claims/ccjClient'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'
import { DraftService } from 'common/draft/draftService'

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
    partyAsCompanyOrOrganisation: user.claim.claimData.claimant.isBusiness(),
    details: user.ccjDraft.document,
    amountToBePaid: user.claim.totalAmount - (user.ccjDraft.document.paidAmount.amount || 0),
    ...prepareUrls(req.params.externalId)
  })
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
  if (user.claim.claimData.claimant.isBusiness()) {
    return QualifiedDeclaration
  } else {
    return Declaration
  }
}

function signatureTypeFor (user: User): string {
  if (user.claim.claimData.claimant.isBusiness()) {
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
          user.ccjDraft.document.qualifiedDeclaration = form.model
        }

        await DraftService.save(user.ccjDraft, user.bearerToken)
        await CCJClient.save(user)
        await DraftService.delete(user.ccjDraft, user.bearerToken)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
