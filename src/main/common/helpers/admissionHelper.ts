import { Claim } from 'claims/models/claim'
import { ResponseType } from 'claims/models/response/responseType'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

export class AdmissionHelper {
  static getAdmittedAmount (claim: Claim): number {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (response === undefined) {
      throw new Error('Claim does not have response attached')
    }

    switch (response.responseType) {
      case ResponseType.FULL_ADMISSION:
        return claim.totalAmountTillToday
      case ResponseType.PART_ADMISSION:
        return response.amount
      default:
        throw new Error(`Response attached to claim is not an admission`)
    }
  }
}
