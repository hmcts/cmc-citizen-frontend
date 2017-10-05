import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { StatementOfTruth } from 'response/form/models/statementOfTruth'

import ClaimStoreClient from 'claims/claimStoreClient'
import User from 'app/idam/user'
import { ResponseType } from 'response/form/models/responseType'
import AllResponseTasksCompletedGuard from 'response/guards/allResponseTasksCompletedGuard'
import { ErrorHandling } from 'common/errorHandling'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedStatementOfTruth } from 'response/form/models/qualifiedStatementOfTruth'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const user: User = res.locals.user
  res.render(Paths.checkAndSendPage.associatedView, {
    paths: Paths,
    claim: user.claim,
    form: form,
    draft: user.responseDraft.document,
    signatureType: signatureTypeFor(user)
  })
}

function defendantIsCounterClaiming (user: User): boolean {
  return user.responseDraft.document.counterClaim &&
    user.responseDraft.document.counterClaim.counterClaim
}

function isStatementOfTruthRequired (user: User): boolean {
  const responseType: ResponseType = user.responseDraft.document.response.type
  return (responseType === ResponseType.OWE_NONE && !defendantIsCounterClaiming(user))
    || responseType === ResponseType.OWE_ALL_PAID_ALL
}

function signatureTypeFor (user: User): string {
  if (isStatementOfTruthRequired(user)) {
    if (user.claim.claimData.defendant.isBusiness()) {
      return SignatureType.QUALIFIED
    } else {
      return SignatureType.BASIC
    }
  } else {
    return SignatureType.NONE
  }
}

function deserializerFunction (value: any): any {
  switch (value.type) {
    case SignatureType.BASIC:
      return StatementOfTruth.fromObject(value)
    case SignatureType.QUALIFIED:
      return QualifiedStatementOfTruth.fromObject(value)
    default:
      throw new Error(`Unknown statement of truth type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (user: User): any {
  if (signatureTypeFor(user) === SignatureType.QUALIFIED) {
    return QualifiedStatementOfTruth
  } else {
    return StatementOfTruth
  }
}

export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const StatementOfTruthClass = getStatementOfTruthClassFor(user)
      renderView(new Form(new StatementOfTruthClass()), res)
    })
  .post(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      const form: Form<any> = req.body
      if (isStatementOfTruthRequired(user) && form.hasErrors()) {
        renderView(form, res)
      } else {
        const responseType = user.responseDraft.document.response.type
        switch (responseType) {
          case ResponseType.OWE_NONE:
            if (defendantIsCounterClaiming(user)) {
              res.redirect(Paths.counterClaimPage.evaluateUri({ externalId: user.claim.externalId }))
              return
            }
            break
          case ResponseType.OWE_SOME_PAID_NONE:
          case ResponseType.OWE_ALL_PAID_SOME:
            res.redirect(Paths.partialAdmissionPage.evaluateUri({ externalId: user.claim.externalId }))
            return
          case ResponseType.OWE_ALL_PAID_NONE:
            res.redirect(Paths.fullAdmissionPage.evaluateUri({ externalId: user.claim.externalId }))
            return
          case ResponseType.OWE_ALL_PAID_ALL:
            break
          default:
            next(new Error('Unknown response type: ' + responseType))
        }

        if (signatureTypeFor(user) === SignatureType.QUALIFIED) {
          user.responseDraft.document.qualifiedStatementOfTruth = form.model
        }
        await DraftService.save(user.responseDraft, user.bearerToken)
        await ClaimStoreClient.saveResponseForUser(user)
        await DraftService.delete(user.responseDraft, user.bearerToken)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
