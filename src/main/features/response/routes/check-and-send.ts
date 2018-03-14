import * as express from 'express'

import { Paths, PayBySetDatePaths, StatementOfMeansPaths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { StatementOfTruth } from 'response/form/models/statementOfTruth'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'app/idam/user'
import { ResponseType } from 'response/form/models/responseType'
import { AllResponseTasksCompletedGuard } from 'response/guards/allResponseTasksCompletedGuard'
import { ErrorHandling } from 'common/errorHandling'
import { SignatureType } from 'app/common/signatureType'
import { QualifiedStatementOfTruth } from 'response/form/models/qualifiedStatementOfTruth'
import { DraftService } from 'services/draftService'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  res.render(Paths.checkAndSendPage.associatedView, {
    paths: Paths,
    statementOfMeansPaths: StatementOfMeansPaths,
    payBySetDatePaths: PayBySetDatePaths,
    claim: claim,
    form: form,
    draft: draft.document,
    signatureType: signatureTypeFor(claim, draft),
    statementOfMeansIsApplicable: StatementOfMeans.isApplicableFor(draft.document)
  })
}

function defendantIsCounterClaiming (draft: Draft<ResponseDraft>): boolean {
  return draft.document.rejectAllOfClaim &&
    draft.document.rejectAllOfClaim.option === RejectAllOfClaimOption.COUNTER_CLAIM
}

function isStatementOfTruthRequired (draft: Draft<ResponseDraft>): boolean {
  const responseType: ResponseType = draft.document.response.type
  return (responseType === ResponseType.DEFENCE && !defendantIsCounterClaiming(draft))
}

function signatureTypeFor (claim: Claim, draft: Draft<ResponseDraft>): string {
  if (isStatementOfTruthRequired(draft)) {
    if (claim.claimData.defendant.isBusiness()) {
      return SignatureType.QUALIFIED
    } else {
      return SignatureType.BASIC
    }
  } else {
    return SignatureType.NONE
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

function getStatementOfTruthClassFor (claim: Claim, draft: Draft<ResponseDraft>): { new(): StatementOfTruth | QualifiedStatementOfTruth } {
  if (signatureTypeFor(claim, draft) === SignatureType.QUALIFIED) {
    return QualifiedStatementOfTruth
  } else {
    return StatementOfTruth
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const StatementOfTruthClass = getStatementOfTruthClassFor(claim, draft)
      renderView(new Form(new StatementOfTruthClass()), res)
    })
  .post(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const user: User = res.locals.user
      const form: Form<StatementOfTruth | QualifiedStatementOfTruth> = req.body
      if (isStatementOfTruthRequired(draft) && form.hasErrors()) {
        renderView(form, res)
      } else {
        const responseType = draft.document.response.type
        switch (responseType) {
          case ResponseType.DEFENCE:
            if (defendantIsCounterClaiming(draft)) {
              res.redirect(Paths.counterClaimPage.evaluateUri({ externalId: claim.externalId }))
              return
            }
            break
          case ResponseType.PART_ADMISSION:
            res.redirect(Paths.partialAdmissionPage.evaluateUri({ externalId: claim.externalId }))
            return
          case ResponseType.FULL_ADMISSION:
            res.redirect(Paths.fullAdmissionPage.evaluateUri({ externalId: claim.externalId }))
            return
          default:
            next(new Error('Unknown response type: ' + responseType))
        }

        if (form.model.type === SignatureType.QUALIFIED) {
          draft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await new DraftService().save(draft, user.bearerToken)
        }
        await claimStoreClient.saveResponseForUser(claim.externalId, draft, user)
        await new DraftService().delete(draft.id, user.bearerToken)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
