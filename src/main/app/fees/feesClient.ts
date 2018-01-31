import * as config from 'config'
import { request } from 'client/request'
import { plainToClass } from 'class-transformer'

import { CalculationOutcome } from 'app/fees/models/calculationOutcome'
import { RangeGroup } from 'app/fees/models/rangeGroup'

import { ClaimValidator } from 'app/utils/claimValidator'
import { StringUtils } from 'utils/stringUtils'
import { MoneyConverter } from 'app/fees/moneyConverter'

const feesUrl = config.get('fees.url')

const issueFeeCode = config.get<string>('fees.issueFee.code')
const hearingFeeCode = config.get<string>('fees.hearingFee.code')

export class FeesClient {

  /**
   * Calculates the issue fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static async calculateIssueFee (claimValue: number): Promise<number> {
    return MoneyConverter.convertPenniesToPounds(((await this.calculateFee(issueFeeCode, claimValue))).amount)
  }

  /**
   * Calculates the hearing fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static async calculateHearingFee (claimValue: number): Promise<number> {
    return MoneyConverter.convertPenniesToPounds(((await this.calculateFee(hearingFeeCode, claimValue))).amount)
  }

  /**
   * Calculates the fee based on fee code and amount
   *
   * @param feeCode which fee category to use
   * @param amount amount in pounds
   * @returns {Promise.<CalculationOutcome>} promise containing the calculation outcome (including fee amount in pennies)
   */
  static async calculateFee (feeCode: string, amount: number): Promise<CalculationOutcome> {
    ClaimValidator.claimAmount(amount)
    const amountInPennies = MoneyConverter.convertPoundsToPennies(amount)
    if (amountInPennies <= 0) {
      throw new Error(`Amount must be at least 1 penny, amount was: ${amountInPennies}`)
    }

    const fee: object = await request.get(`${feesUrl}/range-groups/${feeCode}/calculations?value=${amountInPennies}`)
    return plainToClass(CalculationOutcome, fee)
  }

  /**
   * Get the issue fee range group
   * @returns {Promise.<RangeGroup>} promise containing the range group (including fee amounts in pennies)
   */
  static async getIssueFeeRangeGroup (): Promise<RangeGroup> {
    return this.getRangeGroup(issueFeeCode)
  }

  /**
   * Get hearing fee range group
   * @returns {Promise.<RangeGroup>} promise containing the range group (including fee amounts in pennies)
   */
  static async getHearingFeeRangeGroup (): Promise<RangeGroup> {
    return this.getRangeGroup(hearingFeeCode)
  }

  private static async getRangeGroup (code: string): Promise<RangeGroup> {
    if (StringUtils.isBlank(code)) {
      throw new Error('Fee code is required')
    }
    return plainToClass(RangeGroup, await request.get(`${feesUrl}/range-groups/${code}`) as object)
  }
}
