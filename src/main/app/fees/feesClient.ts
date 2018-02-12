import * as config from 'config'
import { request } from 'client/request'
import { plainToClass } from 'class-transformer'
import { ClaimValidator } from 'app/utils/claimValidator'
import { FeeOutcome } from 'fees/models/feeOutcome'
import { FeeRange } from 'fees/models/feeRange'
import { StringUtils } from 'utils/stringUtils'

const feesUrl = config.get('fees.url')
const service: string = config.get<string>('fees.service')
const jurisdiction1: string = config.get<string>('fees.jurisdiction1')
const jurisdiction2: string = config.get<string>('fees.jurisdiction2')
const onlineChannel: string = config.get<string>('fees.channels.online')
const defaultChannel: string = config.get<string>('fees.channels.paper')
const issueFeeEvent: string = config.get<string>('fees.issueFee.event')
const hearingFeeEvent: string = config.get('fees.hearingFee.event')

export class FeesClient {

  /**
   * Calculates the issue fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static async calculateIssueFee (claimValue: number): Promise<number> {
    return this.calculateFee(issueFeeEvent, claimValue, onlineChannel)
      .then((outcome: FeeOutcome) => outcome.amount)
  }

  /**
   * Calculates the hearing fee a claimant should pay
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static async calculateHearingFee (claimValue: number): Promise<number> {
    return this.calculateFee(hearingFeeEvent, claimValue, defaultChannel)
      .then((outcome: FeeOutcome) => (outcome.amount))
  }
  /**
   * Calculates the fee based on fee event and amount
   *
   * @param eventType which fee event to use
   * @param amount amount in pounds
   * @returns {Promise.<FeeOutcome>} promise containing the Fee outcome (including fee amount in GBP)
   */
  static async calculateFee (eventType: string, amount: number, channel: string): Promise<FeeOutcome> {
    if (StringUtils.isBlank(eventType)) {
      throw new Error('Fee eventType is required')
    }
    ClaimValidator.claimAmount(amount)
    const feeUri: string = `${feesUrl}/fees-register/fees/lookup?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&amount_or_volume=${amount}`
    const fee: object = await request.get(feeUri)
    return plainToClass(FeeOutcome, fee)
  }

  /**
   * Get the issue fee range group
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
   */
  static async getIssueFeeRangeGroup (): Promise<FeeRange[]> {
    return this.getRangeGroup(issueFeeEvent, onlineChannel)
  }

  /**
   * Get hearing fee range group
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
   */
  static async getHearingFeeRangeGroup (): Promise<FeeRange[]> {
    return this.getRangeGroup(hearingFeeEvent, defaultChannel)
  }

  private static async getRangeGroup (eventType: string, channel: string): Promise<FeeRange[]> {
    if (StringUtils.isBlank(eventType)) {
      throw new Error('Fee eventType is required')
    }
    const feeUriForRange: string = `${feesUrl}/fees-register/fees?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&feeVersionStatus=approved`
    const range: object[] = await request.get(feeUriForRange)
    return plainToClass(FeeRange, range)
  }
}
