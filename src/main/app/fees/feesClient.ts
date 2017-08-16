import * as config from 'config'
import ClaimValidator from 'app/utils/claimValidator'
import request from 'client/request'
import { RangeFee } from 'app/fees/rangeFee'
const feesUrl = config.get('fees.url')
const issueFeeCode = config.get<string>('fees.issueFeeCode')
const hearingFeeCode = config.get<string>('fees.hearingFeeCode')

export default class FeesClient {

  /**
   * Calculates the issue fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateIssueFee (claimValue: number): Promise<number> {
    return this.callFeesRegister(issueFeeCode, claimValue)
      .then((feeRange: RangeFee) => this.convertPenniesToPounds(feeRange.amount))
  }

  /**
   * Calculates the hearing fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateHearingFee (claimValue: number): Promise<number> {
    return this.callFeesRegister(hearingFeeCode, claimValue)
      .then((feeRange: RangeFee) => this.convertPenniesToPounds(feeRange.amount))
  }

  /**
   * Call the fees register
   * @param feeCode which fee category to use
   * @param amount amount in pounds
   * @returns {Promise.<RangeFee>} promise containing the fee amount in pennies
   */
  static callFeesRegister (feeCode: string, amount: number): Promise<RangeFee> {
    ClaimValidator.claimAmount(amount)
    const amountInPennies = this.convertPoundsToPennies(amount)
    if (amountInPennies <= 0) {
      throw new Error(`Amount must be at least 1 penny, amount was: ${amountInPennies}`)
    }

    return request.get(`${feesUrl}/fees-register/categories/${feeCode}/ranges/${amountInPennies}/fees`)
      .then((body: any) => new RangeFee(body.type, body.id, body.description, body.amount))
  }

  private static convertPenniesToPounds (amount: number) {
    return amount / 100
  }

  private static convertPoundsToPennies (amount: number) {
    return Math.round(amount * 100)
  }
}
