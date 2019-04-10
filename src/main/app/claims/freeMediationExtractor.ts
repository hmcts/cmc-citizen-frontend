import { MediationDraft } from 'mediation/draft/mediationDraft'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { CompanyDetails } from 'forms/models/companyDetails'

export class FreeMediationExtractor {

  static getFreeMediation (mediationDraft: MediationDraft): YesNoOption {
    return FreeMediationUtil.convertFreeMediation(mediationDraft.youCanOnlyUseMediation)
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
          return draft.defendantDetails.mobilePhone.number ? draft.defendantDetails.mobilePhone.number : undefined
        } else {
          return claim.claimData.claimant.mobilePhone ?
            claim.claimData.claimant.mobilePhone : mediationDraft.canWeUse.mediationPhoneNumber
        }
      } else {
        return mediationDraft.canWeUse.mediationPhoneNumber
      }
    }
  }

  static getMediationContactPerson (claim: Claim, mediationDraft: MediationDraft, draft?: ResponseDraft): string {
    if (mediationDraft.canWeUseCompany) {
      if (mediationDraft.canWeUseCompany.option === FreeMediationOption.YES) {
        if (!claim.isResponseSubmitted() && draft) {
          return (draft.defendantDetails.partyDetails as CompanyDetails).contactPerson ?
            (draft.defendantDetails.partyDetails as CompanyDetails).contactPerson : undefined
        } else {
          return (claim.claimData.claimant as CompanyDetails).contactPerson
        }
      } else {
        return mediationDraft.canWeUseCompany.mediationContactPerson
      }
    }
  }
}
