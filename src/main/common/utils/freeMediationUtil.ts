import { MediationDraft } from 'main/features/mediation/draft/mediationDraft'
import { YesNoOption } from 'main/app/claims/models/response/core/yesNoOption'
import { ResponseDraft } from 'main/features/response/draft/responseDraft'
import { Claim } from 'main/app/claims/models/claim'
import { FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { CompanyDetails } from 'forms/models/companyDetails'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

export class FreeMediationUtil {

  static async getFreeMediation (mediationDraft: MediationDraft): Promise<YesNoOption> {
    const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      if (mediationDraft.willYouTryMediation) {
        return mediationDraft.willYouTryMediation.option as YesNoOption
      } else {
        return YesNoOption.NO
      }
    } else {
      if (!FeatureToggles.isEnabled('mediation') && mediationDraft.willYouTryMediation) {
        return mediationDraft.willYouTryMediation.option as YesNoOption
      } else {
        const freeMediation = mediationDraft.youCanOnlyUseMediation

        if (!freeMediation || !freeMediation.option) {
          return YesNoOption.NO
        } else {
          return freeMediation.option as YesNoOption
        }
      }
    }
  }

  static getMediationPhoneNumber (claim: Claim, mediationDraft: MediationDraft, draft?: ResponseDraft): string {
    if (!FeatureToggles.isEnabled('mediation')) {
      return undefined
    } else if (mediationDraft.canWeUseCompany) {
      if (mediationDraft.canWeUseCompany.option === FreeMediationOption.YES) {
        return mediationDraft.canWeUseCompany.mediationPhoneNumberConfirmation
      } else {
        return mediationDraft.canWeUseCompany.mediationPhoneNumber
      }
    } else if (mediationDraft.canWeUse) {
      if (mediationDraft.canWeUse.option === FreeMediationOption.YES) {
        if (!claim.isResponseSubmitted() && draft) {
          return draft.defendantDetails.phone.number || undefined
        } else {
          return claim.claimData.claimant.phone || mediationDraft.canWeUse.mediationPhoneNumber
        }
      } else {
        return mediationDraft.canWeUse.mediationPhoneNumber
      }
    }
    return undefined
  }

  static getMediationContactPerson (claim: Claim, mediationDraft: MediationDraft, draft?: ResponseDraft): string {
    if (!FeatureToggles.isEnabled('mediation')) {
      return undefined
    } else if (mediationDraft.canWeUseCompany) {
      if (mediationDraft.canWeUseCompany.option === FreeMediationOption.YES) {
        if (!claim.isResponseSubmitted() && draft) {
          return (draft.defendantDetails.partyDetails as CompanyDetails).contactPerson || undefined
        } else {
          return (claim.claimData.claimant as CompanyDetails).contactPerson
        }
      } else {
        return mediationDraft.canWeUseCompany.mediationContactPerson
      }
    }
    return undefined
  }

  static getNoMediationReason (mediationDraft: MediationDraft): string {
    if (mediationDraft.willYouTryMediation && mediationDraft.willYouTryMediation.option === FreeMediationOption.NO) {
      if (mediationDraft.noMediationReason && mediationDraft.noMediationReason.otherReason) {
        return 'Another reason - ' + mediationDraft.noMediationReason.otherReason
      } else if (mediationDraft.noMediationReason && mediationDraft.noMediationReason.iDoNotWantMediationReason) {
        return mediationDraft.noMediationReason.iDoNotWantMediationReason
      }
    }
    return undefined
  }
}
