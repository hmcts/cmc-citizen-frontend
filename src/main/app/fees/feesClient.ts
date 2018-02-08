import * as config from 'config'
import { request } from 'client/request'
import { plainToClass } from 'class-transformer'
import { ClaimValidator } from 'app/utils/claimValidator'
import { FeeOutcome } from 'fees/models/feeOutcome'
import { FeeRange } from 'fees/models/feeRange'

const feesUrl = config.get('fees.url')

const service: string = config.get<string>('fees.service')
const jurisdiction1: string = config.get<string>('fees.jurisdiction1')
const jurisdiction2: string = config.get<string>('fees.jurisdiction2')
const channel: string = config.get<string>('fees.channel')
const issueFeeEvent: string = config.get<string>('fees.issueFee.event')
const hearingFeeEvent: string = config.get('fees.hearingFee.event')

export class FeesClient {

  /**
   * Calculates the issue fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */

  static calculateIssueFee (claimValue: number): Promise<number> {
    return this.calculateFee(issueFeeEvent, claimValue)
      .then((outcome: FeeOutcome) => outcome.amount)
  }

  /**
   * Calculates the hearing fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateHearingFee (claimValue: number): Promise<number> {
    return this.calculateFee(hearingFeeEvent, claimValue)
      .then((outcome: FeeOutcome) => (outcome.amount))
  }

  /**
   * Calculates the fee based on fee event and amount
   *
   * @param eventType which fee event to use
   * @param amount amount in pounds
   * @returns {Promise.<FeeOutcome>} promise containing the Fee outcome (including fee amount in GBP)
   */
  static calculateFee (eventType: string, amount: number): Promise<FeeOutcome> {
    ClaimValidator.claimAmount(amount)
    const feeUri: string = `${feesUrl}/fees-register/fees/lookup?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&amount_or_volume=${amount}`
    return request.get(feeUri).then((body: object) => plainToClass(FeeOutcome, body))
  }
  /**
   * Get the issue fee range group
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in pennies)
   */
  static getIssueFeeRangeGroup (): Promise<FeeRange[]> {
    return this.getRangeGroup(issueFeeEvent)
  }

  /**
   * Get hearing fee range group
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in pennies)
   */
  static getHearingFeeRangeGroup (): Promise<FeeRange[]> {
    return this.getRangeGroup(hearingFeeEvent)
  }

  private static getRangeGroup (eventType: string): Promise<FeeRange[]> {
    const feeUriForRange: string = `${feesUrl}/fees-register/fees?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&feeVersionStatus=approved`
    return request.get(feeUriForRange).then((body: object[]) => plainToClass(FeeRange, body))
  }
}
