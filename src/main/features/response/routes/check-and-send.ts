import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { StatementOfTruth } from 'response/form/models/statementOfTruth'

import ClaimStoreClient from 'claims/claimStoreClient'
import User from 'app/idam/user'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ResponseType } from 'response/form/models/responseType'
import AllResponseTasksCompletedGuard from 'response/guards/allResponseTasksCompletedGuard'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const user: User = res.locals.user
  res.render(Paths.checkAndSendPage.associatedView, {
    paths: Paths,
    claim: user.claim,
    form: form,
    draft: user.responseDraft,
    isStatementOfTruthRequired: isStatementOfTruthRequired(user)
  })
}

function defendantIsCounterClaiming (user: User): boolean {
  return user.responseDraft.counterClaim &&
    user.responseDraft.counterClaim.counterClaim
}

function isStatementOfTruthRequired (user: User): boolean {
  const responseType: ResponseType = user.responseDraft.response.type
  return (responseType === ResponseType.OWE_NONE && !defendantIsCounterClaiming(user))
    || responseType === ResponseType.OWE_ALL_PAID_ALL
}

export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      renderView(new Form(undefined), res)
    })
  .post(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(StatementOfTruth, StatementOfTruth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruth> = req.body
      const user: User = res.locals.user
      if (isStatementOfTruthRequired(user) && form.hasErrors()) {
        renderView(form, res)
      } else {
        const responseType = user.responseDraft.response.type
        switch (responseType) {
          case ResponseType.OWE_NONE:
            if (defendantIsCounterClaiming(user)) {
              res.redirect(Paths.counterClaimPage.uri)
              return
            }
            break
          case ResponseType.OWE_SOME_PAID_NONE:
          case ResponseType.OWE_ALL_PAID_SOME:
            res.redirect(Paths.partialAdmissionPage.uri)
            return
          case ResponseType.OWE_ALL_PAID_NONE:
            res.redirect(Paths.fullAdmissionPage.uri)
            return
          case ResponseType.OWE_ALL_PAID_ALL:
            break
          default:
            next(new Error('Unknown response type: ' + responseType))
        }

        await ClaimStoreClient.saveResponseForUser(user)
        await ResponseDraftMiddleware.delete(res, next)
        res.redirect(Paths.confirmationPage.uri)
      }
    }))
