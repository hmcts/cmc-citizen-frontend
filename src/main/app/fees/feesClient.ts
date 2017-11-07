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
  static calculateIssueFee (claimValue: number): Promise<number> {
    return this.calculateFee(issueFeeCode, claimValue)
      .then((outcome: CalculationOutcome) => MoneyConverter.convertPenniesToPounds(outcome.amount))
  }

  /**
   * Calculates the hearing fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateHearingFee (claimValue: number): Promise<number> {
    return this.calculateFee(hearingFeeCode, claimValue)
      .then((outcome: CalculationOutcome) => MoneyConverter.convertPenniesToPounds(outcome.amount))
  }

  /**
   * Calculates the fee based on fee code and amount
   *
   * @param feeCode which fee category to use
   * @param amount amount in pounds
   * @returns {Promise.<CalculationOutcome>} promise containing the calculation outcome (including fee amount in pennies)
   */
  static calculateFee (feeCode: string, amount: number): Promise<CalculationOutcome> {
    ClaimValidator.claimAmount(amount)
    const amountInPennies = MoneyConverter.convertPoundsToPennies(amount)
    if (amountInPennies <= 0) {
      throw new Error(`Amount must be at least 1 penny, amount was: ${amountInPennies}`)
    }

    return request.get(`${feesUrl}/range-groups/${feeCode}/calculations?value=${amountInPennies}`)
      .then((body: any) => plainToClass(CalculationOutcome, body))
  }
  /**
   * Get the issue fee range group
   * @returns {Promise.<RangeGroup>} promise containing the range group (including fee amounts in pennies)
   */
  static getIssueFeeRangeGroup (): Promise<RangeGroup> {
    return this.getRangeGroup(issueFeeCode)
  }

  /**
   * Get hearing fee range group
   * @returns {Promise.<RangeGroup>} promise containing the range group (including fee amounts in pennies)
   */
  static getHearingFeeRangeGroup (): Promise<RangeGroup> {
    return this.getRangeGroup(hearingFeeCode)
  }

  private static getRangeGroup (code: string): Promise<RangeGroup> {
    if (StringUtils.isBlank(code)) {
      throw new Error('Fee code is required')
    }
    return request.get(`${feesUrl}/range-groups/${code}`)
      .then((body: any) => {
        return plainToClass(RangeGroup, body)
      })
  }
}
