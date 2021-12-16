import * as config from 'config'
import { request } from 'client/request'
import { plainToClass } from 'class-transformer'
import { ClaimValidator } from 'utils/claimValidator'
import { FeeOutcome } from 'fees/models/feeOutcome'
import { FeeRange } from 'fees/models/feeRange'
import { StringUtils } from 'utils/stringUtils'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const feesUrl = config.get<string>('fees.url')
const service = config.get<string>('fees.service')
const jurisdiction1 = config.get<string>('fees.jurisdiction1')
const jurisdiction2 = config.get<string>('fees.jurisdiction2')
const onlineChannel = config.get<string>('fees.channel.online')
const paperChannel = config.get<string>('fees.channel.paper')
const issueFeeEvent = config.get<string>('fees.issueFee.event')
const hearingFeeEvent = config.get<string>('fees.hearingFee.event')
const issueFeeKeyWord = config.get<string>('fees.issueFee.keyword')
const hearingFeeKeyWord = config.get<string>('fees.hearingFee.keyword')
const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

export class FeesClient {

  /**
   * Calculates the issue fee a claimant should pay with online channel
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static async F (claimValue: number): Promise<number> {
    if (await featureToggles.isNewClaimFeesEnabled()) {
      return this.calculateFee(issueFeeEvent, claimValue, paperChannel, issueFeeKeyWord)
      .then((outcome: FeeOutcome) => outcome.amount)
    } else {
      return this.calculateFee(issueFeeEvent, claimValue, onlineChannel, issueFeeKeyWord)
      .then((outcome: FeeOutcome) => outcome.amount)
    }
  }

  /**
   * Retrieves the fee code for claim issuance fee for HWF claims
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<string>} promise containing the fee code
   */
  static async retrieveClaimIssuanceFeeCode (claimValue: number): Promise<string> {
    return this.calculateFee(issueFeeEvent, claimValue, paperChannel, issueFeeKeyWord)
    .then((outcome: FeeOutcome) => outcome.code)
  }

  /**
   * Calculates the hearing fee a claimant should pay with paper/default channel
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateHearingFee (claimValue: number): Promise<number> {
    return this.calculateFee(hearingFeeEvent, claimValue, paperChannel, hearingFeeKeyWord)
      .then((outcome: FeeOutcome) => outcome.amount)
  }

  /**
   * Calculates the fee based on fee event and amount
   *
   * @param eventType which fee event to use
   * @param amount amount in GBP
   * @param channel online or paper/default
   * @returns {Promise.<FeeOutcome>} promise containing the Fee outcome (including fee amount in GBP)
   */
  static async calculateFee (eventType: string, amount: number, channel: string, keyword: string): Promise<FeeOutcome> {
    if (StringUtils.isBlank(eventType)) {
      throw new Error('Fee eventType is required')
    }
    if (StringUtils.isBlank(channel)) {
      throw new Error('Fee channel is required')
    }
    if(StringUtils.isBlank(keyword)) {
      throw new Error('Keyword is required')
    }
    ClaimValidator.claimAmount(amount)
    const feeUri: string = `${feesUrl}/fees-register/fees/lookup?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&keyword=${keyword}&amount_or_volume=${amount}`
    const options = {
      uri: feeUri
    }
    return request(options).then(function (response) {
      return plainToClass(FeeOutcome, response as object)
    })
  }

  /**
   * Get the issue fee range group with online channel
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
   */
  static async getIssueFeeRangeGroup (): Promise<FeeRange[]> {
    if (await featureToggles.isNewClaimFeesEnabled()) {
      return this.getRangeGroup(issueFeeEvent, paperChannel)
    } else {
      return this.getRangeGroup(issueFeeEvent, onlineChannel)
    }
  }

  /**
   * Get hearing fee range group with default/paper channel
   * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
   */
  static getHearingFeeRangeGroup (): Promise<FeeRange[]> {
    return this.getRangeGroup(hearingFeeEvent, paperChannel)
  }

  private static async getRangeGroup (eventType: string, channel: string): Promise<FeeRange[]> {
    if (StringUtils.isBlank(eventType)) {
      throw new Error('Fee eventType is required')
    }
    if (StringUtils.isBlank(channel)) {
      throw new Error('Fee channel is required')
    }
    const uri: string = `${feesUrl}/fees-register/fees?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&feeVersionStatus=approved`
    const options = {
      uri: uri
    }
    return request(options).then(function (response) {
      return plainToClass(FeeRange, response as object[])
    })

  }
}
