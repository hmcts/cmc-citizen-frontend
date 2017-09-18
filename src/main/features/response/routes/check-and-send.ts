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
import { SignatureType } from 'app/common/signatureType'
import { ResponseDraft } from 'response/draft/responseDraft'
import { PartyType } from 'app/common/partyType'

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const user: User = res.locals.user
  res.render(Paths.checkAndSendPage.associatedView, {
    paths: Paths,
    form: form,
    draft: user.responseDraft,
    isStatementOfTruthRequired: isStatementOfTruthRequired(user),
    signatureType: determineSignatureType(user)
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

function isCompanyOrOrganisationDefendant (user: User): boolean {
  const responseDraft: ResponseDraft = user.responseDraft
  if (responseDraft.defendantDetails && responseDraft.defendantDetails.partyDetails) {
    const type: string = responseDraft.defendantDetails.partyDetails.type
    return type === PartyType.COMPANY.value || type === PartyType.ORGANISATION.value
  } else {
    return false
  }
}

function determineSignatureType (user: User): string {
  if (isStatementOfTruthRequired(user)) {
    if (isCompanyOrOrganisationDefendant(user)) {
      return SignatureType.QUALIFIED
    } else {
      return SignatureType.BASIC
    }
  } else {
    return SignatureType.NONE
  }
}

export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), res)
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
