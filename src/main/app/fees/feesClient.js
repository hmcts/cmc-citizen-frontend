"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const request_1 = require("client/request");
const class_transformer_1 = require("class-transformer");
const claimValidator_1 = require("utils/claimValidator");
const feeOutcome_1 = require("fees/models/feeOutcome");
const feeRange_1 = require("fees/models/feeRange");
const stringUtils_1 = require("utils/stringUtils");
const feesUrl = config.get('fees.url');
const service = config.get('fees.service');
const jurisdiction1 = config.get('fees.jurisdiction1');
const jurisdiction2 = config.get('fees.jurisdiction2');
const onlineChannel = config.get('fees.channel.online');
const paperChannel = config.get('fees.channel.paper');
const issueFeeEvent = config.get('fees.issueFee.event');
const hearingFeeEvent = config.get('fees.hearingFee.event');
class FeesClient {
    /**
     * Calculates the issue fee a claimant should pay with online channel
     *
     * @param {number} claimValue the amount claiming for in pounds
     * @returns {Promise.<number>} promise containing the fee amount in pounds
     */
    static calculateIssueFee(claimValue) {
        return this.calculateFee(issueFeeEvent, claimValue, onlineChannel)
            .then((outcome) => outcome.amount);
    }
    /**
     * Calculates the hearing fee a claimant should pay with paper/default channel
     *
     * @param {number} claimValue the amount claiming for in pounds
     * @returns {Promise.<number>} promise containing the fee amount in pounds
     */
    static calculateHearingFee(claimValue) {
        return this.calculateFee(hearingFeeEvent, claimValue, paperChannel)
            .then((outcome) => outcome.amount);
    }
    /**
     * Calculates the fee based on fee event and amount
     *
     * @param eventType which fee event to use
     * @param amount amount in GBP
     * @param channel online or paper/default
     * @returns {Promise.<FeeOutcome>} promise containing the Fee outcome (including fee amount in GBP)
     */
    static async calculateFee(eventType, amount, channel) {
        if (stringUtils_1.StringUtils.isBlank(eventType)) {
            throw new Error('Fee eventType is required');
        }
        if (stringUtils_1.StringUtils.isBlank(channel)) {
            throw new Error('Fee channel is required');
        }
        claimValidator_1.ClaimValidator.claimAmount(amount);
        const feeUri = `${feesUrl}/fees-register/fees/lookup?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&amount_or_volume=${amount}`;
        const options = {
            uri: feeUri
        };
        return request_1.request(options).then(function (response) {
            return class_transformer_1.plainToClass(feeOutcome_1.FeeOutcome, response);
        });
    }
    /**
     * Get the issue fee range group with online channel
     * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
     */
    static getIssueFeeRangeGroup() {
        return this.getRangeGroup(issueFeeEvent, onlineChannel);
    }
    /**
     * Get hearing fee range group with default/paper channel
     * @returns {Promise.<FeeRange>} promise containing the range group (including fee amounts in GBP)
     */
    static getHearingFeeRangeGroup() {
        return this.getRangeGroup(hearingFeeEvent, paperChannel);
    }
    static async getRangeGroup(eventType, channel) {
        if (stringUtils_1.StringUtils.isBlank(eventType)) {
            throw new Error('Fee eventType is required');
        }
        if (stringUtils_1.StringUtils.isBlank(channel)) {
            throw new Error('Fee channel is required');
        }
        const uri = `${feesUrl}/fees-register/fees?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${channel}&event=${eventType}&feeVersionStatus=approved`;
        const options = {
            uri: uri
        };
        return request_1.request(options).then(function (response) {
            return class_transformer_1.plainToClass(feeRange_1.FeeRange, response);
        });
    }
}
exports.FeesClient = FeesClient;
