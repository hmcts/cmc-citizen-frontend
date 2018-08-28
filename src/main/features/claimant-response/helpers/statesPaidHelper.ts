import { ResponseType } from 'claims/models/response/responseType'
import { Claim } from 'claims/models/claim'
import { DefenceType } from 'claims/models/response/defenceType'

export class StatesPaidHelper {
  static isResponseAlreadyPaid (claim: Claim): boolean {
    switch (claim.response.responseType) {
      case ResponseType.FULL_DEFENCE:
        return claim.response.defenceType === DefenceType.ALREADY_PAID
      case ResponseType.PART_ADMISSION:
        return claim.response.paymentDeclaration !== undefined
      default:
        return false
    }
  }

  static isAlreadyPaidLessThanAmount (claim: Claim): boolean {
    switch (claim.response.responseType) {
      case ResponseType.FULL_DEFENCE:
        return false
      case ResponseType.PART_ADMISSION:
        return claim.response.amount < claim.totalAmountTillDateOfIssue
    }
  }

  static getAlreadyPaidAmount (claim: Claim): number {
    switch (claim.response.responseType) {
      case ResponseType.FULL_DEFENCE:
        return claim.totalAmountTillDateOfIssue
      case ResponseType.PART_ADMISSION:
        return claim.response.amount
    }
  }

}
