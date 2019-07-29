import { Claim } from 'claims/models/claim'
import { ResponseType } from 'claims/models/response/responseType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

export function amountSettledFor (claim: Claim): number {
  if (isPartAdmissionAcceptation(claim)) {
    const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse
    return Math.max(response.amount - claim.claimData.feeAmountInPennies / 100, 0)
  }
  return undefined
}

export function claimFeeInPennies (claim: Claim): number {
  if (this.isPartAdmissionAcceptation(claim)) {
    const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse
    if (amountSettledFor(claim) === 0 && response.amount < claim.claimData.feeAmountInPennies / 100) {
      return response.amount * 100
    } else {
      return claim.claimData.feeAmountInPennies
    }
  } else {
    return claim.claimData.feeAmountInPennies
  }
}

export function isPartAdmissionAcceptation (claim: Claim): boolean {
  return claim.response && claim.response.responseType === ResponseType.PART_ADMISSION
    && claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION
}
