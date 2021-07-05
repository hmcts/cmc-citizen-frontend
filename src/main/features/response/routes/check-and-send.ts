import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { StatementOfTruth } from 'response/form/models/statementOfTruth'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { ResponseType } from 'response/form/models/responseType'
import { AllResponseTasksCompletedGuard } from 'response/guards/allResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { SignatureType } from 'common/signatureType'
import { QualifiedStatementOfTruth } from 'response/form/models/qualifiedStatementOfTruth'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { StatementOfMeansFeature } from 'response/helpers/statementOfMeansFeature'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { FeatureToggles } from 'utils/featureToggles'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import * as uuid from 'uuid'
import { PcqClient } from 'utils/pcqClient'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

async function renderView (form: Form<StatementOfTruth>, res: express.Response): Promise<void> {
  const claim: Claim = res.locals.claim
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
  const directionsQuestionnaireDraft: Draft<DirectionsQuestionnaireDraft> = res.locals.directionsQuestionnaireDraft
  const dqsEnabled: boolean = (ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) && (draft.document.response.type === ResponseType.DEFENCE || draft.document.response.type === ResponseType.PART_ADMISSION)
  let datesUnavailable: string[]
  if (dqsEnabled) {
    datesUnavailable = directionsQuestionnaireDraft.document.availability.unavailableDates.map(date => date.toMoment().format('LL'))
  }
  const statementOfTruthType = SignatureType.RESPONSE
  if (dqsEnabled) {
    if (form.model.type === SignatureType.QUALIFIED) {
      form.model.type = SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED
    } else {
      form.model.type = SignatureType.DIRECTION_QUESTIONNAIRE
    }
  }

  res.render(Paths.checkAndSendPage.associatedView, {
    claim: claim,
    form: form,
    draft: draft.document,
    signatureType: signatureTypeFor(claim, draft),
    statementOfMeansIsApplicable: StatementOfMeansFeature.isApplicableFor(claim, draft.document),
    dqsEnabled: dqsEnabled,
    mediationDraft: mediationDraft,
    contactPerson: FreeMediationUtil.getMediationContactPerson(claim, mediationDraft.document, draft.document),
    contactNumber: FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft.document, draft.document),
    directionsQuestionnaireDraft: directionsQuestionnaireDraft.document,
    datesUnavailable: datesUnavailable,
    statementOfTruthType: statementOfTruthType,
    mediationEnabled: FeatureToggles.isEnabled('mediation'),
    timeline: getTimeline(draft),
    evidence: getEvidence(draft)
  })
}

function rejectingFullAmount (draft: Draft<ResponseDraft>): boolean {
  return draft.document.response.type === ResponseType.DEFENCE
    || draft.document.response.type === ResponseType.PART_ADMISSION
}

function getDisagreementRoot (draft: Draft<ResponseDraft>): { timeline?: DefendantTimeline, evidence?: DefendantEvidence } {
  if (draft.document.isResponseRejected()) {
    return draft.document
  } else {
    return draft.document.partialAdmission
  }
}

function getTimeline (draft: Draft<ResponseDraft>): DefendantTimeline {
  if (rejectingFullAmount(draft)) {
    const timeline = getDisagreementRoot(draft).timeline
    timeline.removeExcessRows()
    if (timeline.rows.length > 0 || timeline.comment) {
      return timeline
    }
  }
  return undefined
}

function getEvidence (draft: Draft<ResponseDraft>): DefendantEvidence {
  if (rejectingFullAmount(draft)) {
    const evidence = getDisagreementRoot(draft).evidence
    evidence.removeExcessRows()
    if (evidence.rows.length > 0 || evidence.comment) {
      return evidence
    }
  }
  return undefined
}

function defendantIsCounterClaiming (draft: Draft<ResponseDraft>): boolean {
  return draft.document.rejectAllOfClaim &&
    draft.document.rejectAllOfClaim.option === RejectAllOfClaimOption.COUNTER_CLAIM
}

function isStatementOfTruthRequired (draft: Draft<ResponseDraft>): boolean {
  return !defendantIsCounterClaiming(draft)
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
    case SignatureType.DIRECTION_QUESTIONNAIRE:
      return StatementOfTruth.fromObject(value)
    case SignatureType.QUALIFIED:
    case SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED:
      return QualifiedStatementOfTruth.fromObject(value)
    default:
      throw new Error(`Unknown statement of truth type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (claim: Claim, draft: Draft<ResponseDraft>): { new (): StatementOfTruth | QualifiedStatementOfTruth } {
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
     async (req: express.Request, res: express.Response) => {
       const claim: Claim = res.locals.claim
       const draft: Draft<ResponseDraft> = res.locals.responseDraft
       const user: User = res.locals.user
       let redirectUri = null
       const launchDarklyClient = new LaunchDarklyClient()
       const featureToggles = new FeatureToggles(launchDarklyClient)
       if (await featureToggles.isPcqEnabled()) {
         const isEligible = await PcqClient.isEligibleRedirect(draft.document.defendantDetails.partyDetails.pcqId,draft.document.defendantDetails.partyDetails.type)
         if (draft.document.defendantDetails.partyDetails.pcqId === undefined) {
           let pcqID = uuid()
           draft.document.defendantDetails.partyDetails.pcqId = pcqID
           new DraftService().save(draft, user.bearerToken)
           if (isEligible) {
             redirectUri = PcqClient.generateRedirectUrl(req, 'DEFENDANT', pcqID, user.email, claim.ccdCaseId, Paths.checkAndSendPage, draft.document.externalId)
           }
         }
       }
       if (redirectUri === null) {
         const StatementOfTruthClass = getStatementOfTruthClassFor(claim, draft)
         await renderView(new Form(new StatementOfTruthClass()), res)
       } else {
         res.redirect(redirectUri)
       }
     })
  .post(
    Paths.checkAndSendPage.uri,
    AllResponseTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const directionsQuestionnaireDraft: Draft<DirectionsQuestionnaireDraft> = res.locals.directionsQuestionnaireDraft
      const user: User = res.locals.user
      const form: Form<StatementOfTruth | QualifiedStatementOfTruth> = req.body

      if (isStatementOfTruthRequired(draft) && form.hasErrors()) {
        await renderView(form, res)
      } else {
        const responseType = draft.document.response.type
        switch (responseType) {
          case ResponseType.DEFENCE:
            if (defendantIsCounterClaiming(draft)) {
              res.redirect(Paths.counterClaimPage.evaluateUri({ externalId: claim.externalId }))
              return
            }
            break
          case ResponseType.FULL_ADMISSION:
          case ResponseType.PART_ADMISSION:
            break
          default:
            next(new Error('Unknown response type: ' + responseType))
        }

        const draftService = new DraftService()
        if (form.model.type === SignatureType.QUALIFIED || form.model.type === SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED) {
          draft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await draftService.save(draft, user.bearerToken)
        }
        await claimStoreClient.saveResponseForUser(claim, draft, mediationDraft, directionsQuestionnaireDraft, user)
        await draftService.delete(draft.id, user.bearerToken)

        if (draft.document.response.type !== ResponseType.FULL_ADMISSION && mediationDraft.id) {
          await draftService.delete(mediationDraft.id, user.bearerToken)
        }

        if (FeatureToggles.isEnabled('directionsQuestionnaire') && directionsQuestionnaireDraft.id && (draft.document.response.type === ResponseType.DEFENCE || draft.document.response.type === ResponseType.PART_ADMISSION)) {
          await draftService.delete(directionsQuestionnaireDraft.id, user.bearerToken)
        }

        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
