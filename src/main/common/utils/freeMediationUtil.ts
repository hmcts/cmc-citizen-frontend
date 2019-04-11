import { MediationDraft } from 'main/features/mediation/draft/mediationDraft'
import { YesNoOption } from 'main/app/claims/models/response/core/yesNoOption'
import { ResponseDraft } from 'main/features/response/draft/responseDraft'
import { Claim } from 'main/app/claims/models/claim'
import { FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { CompanyDetails } from 'main/app/forms/models/companyDetails'

export class FreeMediationUtil {

  static getFreeMediation (mediationDraft: MediationDraft): YesNoOption {
    const freeMediation = mediationDraft.youCanOnlyUseMediation

    if (!freeMediation || !freeMediation.option) {
      return YesNoOption.NO
    } else {
      return freeMediation.option as YesNoOption
    }
  }

  static getMediationPhoneNumber (claim: Claim, mediationDraft: MediationDraft, draft?: ResponseDraft): string {
    if (mediationDraft.canWeUseCompany) {
      if (mediationDraft.canWeUseCompany.option === FreeMediationOption.YES) {
        return mediationDraft.canWeUseCompany.mediationPhoneNumberConfirmation
      } else {
        return mediationDraft.canWeUseCompany.mediationPhoneNumber
      }
    } else if (mediationDraft.canWeUse) {
      if (mediationDraft.canWeUse.option === FreeMediationOption.YES) {
        if (!claim.isResponseSubmitted() && draft) {
          return draft.defendantDetails.mobilePhone.number || undefined
        } else {
          return claim.claimData.claimant.mobilePhone || mediationDraft.canWeUse.mediationPhoneNumber
        }
      } else {
        return mediationDraft.canWeUse.mediationPhoneNumber
      }
    }
    return undefined
  }

  static getMediationContactPerson (claim: Claim, mediationDraft: MediationDraft, draft?: ResponseDraft): string {
    if (mediationDraft.canWeUseCompany) {
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
}
