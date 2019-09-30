import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export interface ExpertRequest {
  expertRequired?: YesNoOption,
  expertEvidenceToExamine?: string,
  reasonForExpertAdvice?: string
}
