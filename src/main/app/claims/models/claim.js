"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimData_1 = require("claims/models/claimData");
const momentFactory_1 = require("shared/momentFactory");
const response_1 = require("claims/models/response");
const responseType_1 = require("claims/models/response/responseType");
const countyCourtJudgment_1 = require("claims/models/countyCourtJudgment");
const claimantResponse_1 = require("claims/models/claimantResponse");
const settlement_1 = require("claims/models/settlement");
const claimStatus_1 = require("claims/models/claimStatus");
const isPastDeadline_1 = require("claims/isPastDeadline");
const paymentOption_1 = require("claims/models/paymentOption");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const reDetermination_1 = require("claims/models/claimant-response/reDetermination");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const statementType_1 = require("offer/form/models/statementType");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const localDate_1 = require("forms/models/localDate");
const partyType_1 = require("common/partyType");
const defenceType_1 = require("claims/models/response/defenceType");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const calendarClient_1 = require("claims/calendarClient");
const directionOrder_1 = require("claims/models/directionOrder");
const reviewOrder_1 = require("claims/models/reviewOrder");
const mediationOutcome_1 = require("claims/models/mediationOutcome");
const yesNoOption_1 = require("models/yesNoOption");
const claimDocument_1 = require("claims/models/claimDocument");
const _ = require("lodash");
const claimDocumentType_1 = require("common/claimDocumentType");
class Claim {
    get defendantOffer() {
        if (!this.settlement) {
            return undefined;
        }
        return this.settlement.getDefendantOffer();
    }
    get respondToResponseDeadline() {
        if (!this.respondedAt) {
            return undefined;
        }
        const daysForService = 5;
        const daysForResponse = 28;
        return this.respondedAt.clone().add(daysForService + daysForResponse, 'days');
    }
    async respondToMediationDeadline() {
        if (!this.respondedAt) {
            return undefined;
        }
        return new calendarClient_1.CalendarClient().getNextWorkingDayAfterDays(this.respondedAt, 5);
    }
    async respondToReviewOrderDeadline() {
        if (!this.reviewOrder) {
            return undefined;
        }
        return new calendarClient_1.CalendarClient().getNextWorkingDayAfterDays(this.reviewOrder.requestedAt, 19);
    }
    async respondToReconsiderationDeadline() {
        if (!this.directionOrder) {
            return undefined;
        }
        return new calendarClient_1.CalendarClient().getNextWorkingDayAfterDays(this.directionOrder.createdOn, 19);
    }
    get remainingDays() {
        return this.responseDeadline.diff(momentFactory_1.MomentFactory.currentDate(), 'days');
    }
    get eligibleForCCJ() {
        return !this.countyCourtJudgmentRequestedAt
            && (this.admissionPayImmediatelyPastPaymentDate
                || this.partAdmissionPayImmediatelyPastPaymentDate
                || this.hasDefendantNotSignedSettlementAgreementInTime()
                || (!this.respondedAt && isPastDeadline_1.isPastDeadline(momentFactory_1.MomentFactory.currentDateTime(), this.responseDeadline)));
    }
    get eligibleForCCJAfterBreachedSettlementTerms() {
        if (this.response && this.settlement && this.settlement.isThroughAdmissionsAndSettled()) {
            const lastOffer = this.settlement.getLastOffer();
            if (lastOffer && lastOffer.paymentIntention) {
                const paymentOption = lastOffer.paymentIntention.paymentOption;
                switch (paymentOption) {
                    case paymentOption_1.PaymentOption.BY_SPECIFIED_DATE:
                        return !this.countyCourtJudgmentRequestedAt
                            && isPastDeadline_1.isPastDeadline(momentFactory_1.MomentFactory.currentDateTime(), (this.settlement.partyStatements.filter(o => o.type === statementType_1.StatementType.OFFER.value).pop().offer.completionDate));
                    case paymentOption_1.PaymentOption.INSTALMENTS:
                        return !this.countyCourtJudgmentRequestedAt
                            && isPastDeadline_1.isPastDeadline(momentFactory_1.MomentFactory.currentDateTime(), (this.settlement.partyStatements.filter(o => o.type === statementType_1.StatementType.OFFER.value).pop().offer.paymentIntention.repaymentPlan.firstPaymentDate));
                    default:
                        throw new Error(`Payment option ${paymentOption} is not supported`);
                }
            }
        }
        return false;
    }
    get status() {
        if (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt && this.isCCJPaidWithinMonth()) {
            return claimStatus_1.ClaimStatus.PAID_IN_FULL_CCJ_CANCELLED;
        }
        else if (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt) {
            return claimStatus_1.ClaimStatus.PAID_IN_FULL_CCJ_SATISFIED;
        }
        else if (this.hasOrderBeenDrawn()) {
            if (this.reviewOrder) {
                return claimStatus_1.ClaimStatus.REVIEW_ORDER_REQUESTED;
            }
            else {
                return claimStatus_1.ClaimStatus.ORDER_DRAWN;
            }
        }
        else if (this.paperResponse && this.paperResponse === yesNoOption_1.YesNoOption.YES) {
            return claimStatus_1.ClaimStatus.DEFENDANT_PAPER_RESPONSE;
        }
        else if (this.moneyReceivedOn) {
            return claimStatus_1.ClaimStatus.PAID_IN_FULL;
        }
        else if (this.countyCourtJudgmentRequestedAt) {
            if (this.hasClaimantAcceptedAdmissionWithCCJ()) {
                return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_REQUESTED_CCJ;
            }
            else if (this.hasClaimantSuggestedAlternativePlanWithCCJ()) {
                return claimStatus_1.ClaimStatus.CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ;
            }
            else if (this.hasRedeterminationBeenRequested()) {
                return claimStatus_1.ClaimStatus.REDETERMINATION_BY_JUDGE;
            }
            else if (this.hasCCJBeenRequestedAfterSettlementBreached()) {
                return claimStatus_1.ClaimStatus.CCJ_AFTER_SETTLEMENT_BREACHED;
            }
            else if (this.hasCCJByDeterminationBeenRequestedAfterSettlementBreached()) {
                return claimStatus_1.ClaimStatus.CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED;
            }
            else if (this.hasClaimantRequestedCCJAfterDefendantRejectsSettlementAgreement()) {
                return claimStatus_1.ClaimStatus.CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT;
            }
            else {
                return claimStatus_1.ClaimStatus.CCJ_REQUESTED;
            }
        }
        else if (this.isSettlementAgreementRejected) {
            return claimStatus_1.ClaimStatus.SETTLEMENT_AGREEMENT_REJECTED;
        }
        else if (this.isSettlementReachedThroughAdmission()) {
            return claimStatus_1.ClaimStatus.ADMISSION_SETTLEMENT_AGREEMENT_REACHED;
        }
        else if (this.admissionPayImmediatelyPastPaymentDate && !this.claimantResponse) {
            return claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE;
        }
        else if (this.partAdmissionPayImmediatelyPastPaymentDate) {
            return claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE;
        }
        else if (this.hasDefendantNotSignedSettlementAgreementInTime()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED;
        }
        else if (this.hasClaimantAcceptedOfferAndSignedSettlementAgreement()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION;
        }
        else if (this.hasClaimantSignedSettlementAgreementChosenByCourt()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT;
        }
        else if (this.isSettlementReached()) {
            return claimStatus_1.ClaimStatus.OFFER_SETTLEMENT_REACHED;
        }
        else if (this.hasClaimantRejectedDefendantDefenceWithoutDQs()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ;
        }
        else if (this.hasIntentionToProceedDeadlinePassed()) {
            return claimStatus_1.ClaimStatus.INTENTION_TO_PROCEED_DEADLINE_PASSED;
        }
        else if (this.hasDefendantRejectedClaimWithDQs()) {
            return claimStatus_1.ClaimStatus.DEFENDANT_REJECTS_WITH_DQS;
        }
        else if (this.hasClaimantAcceptedStatesPaid()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_STATES_PAID;
        }
        else if (this.hasClaimantRejectedStatesPaid()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_STATES_PAID;
        }
        else if (this.hasClaimantRejectedPartAdmission()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION;
        }
        else if (this.hasClaimantRejectedPartAdmissionDQs()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION_DQ;
        }
        else if (this.hasClaimantRejectedDefendantResponse() && this.isDefendantBusiness()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE;
        }
        else if (this.hasClaimantRejectedDefendantDefence()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE;
        }
        else if (this.hasClaimantAcceptedDefendantDefence()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_DEFENCE;
        }
        else if (this.hasClaimantAcceptedDefendantPartAdmissionResponseWithAlternativePaymentIntention() && this.isDefendantBusiness()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_PART_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE;
        }
        else if (this.hasClaimantAcceptedDefendantFullAdmissionResponseWithAlternativePaymentIntention() && this.isDefendantBusiness()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_FULL_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE;
        }
        else if (this.hasClaimantAcceptedPartAdmitPayImmediately()) {
            return claimStatus_1.ClaimStatus.PART_ADMIT_PAY_IMMEDIATELY;
        }
        else if (this.eligibleForCCJ) {
            return claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ;
        }
        else if (this.isResponseSubmitted()) {
            return claimStatus_1.ClaimStatus.RESPONSE_SUBMITTED;
        }
        else if (this.isInterlocutoryJudgmentRequestedOnAdmissions()) {
            return claimStatus_1.ClaimStatus.REDETERMINATION_BY_JUDGE;
        }
        else if (this.isClaimantResponseSubmitted()) {
            return claimStatus_1.ClaimStatus.CLAIMANT_RESPONSE_SUBMITTED;
        }
        else if (this.moreTimeRequested) {
            return claimStatus_1.ClaimStatus.MORE_TIME_REQUESTED;
        }
        else if (!this.response) {
            return claimStatus_1.ClaimStatus.NO_RESPONSE;
        }
        else {
            throw new Error('Unknown Status');
        }
    }
    get stateHistory() {
        const statuses = [{ status: this.status }];
        if (this.isOfferRejected() && !this.isSettlementReached() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
            statuses.push({ status: claimStatus_1.ClaimStatus.OFFER_REJECTED });
        }
        else if (this.isOfferAccepted() && !this.isSettlementReached() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn) {
            statuses.push({ status: claimStatus_1.ClaimStatus.OFFER_ACCEPTED });
        }
        else if (this.isOfferSubmitted() && !this.settlement.isThroughAdmissions() && !this.moneyReceivedOn && !this.isSettlementReached()) {
            statuses.push({ status: claimStatus_1.ClaimStatus.OFFER_SUBMITTED });
        }
        if (this.eligibleForCCJAfterBreachedSettlementTerms) {
            statuses.push({ status: claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT });
        }
        if (this.isPaidInFullLinkEligible()) {
            statuses.push({ status: claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE });
        }
        return statuses;
    }
    get admissionPayImmediatelyPastPaymentDate() {
        return this.response
            && (this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION)
            && this.response.paymentIntention
            && this.response.paymentIntention.paymentOption === paymentOption_1.PaymentOption.IMMEDIATELY
            && this.response.paymentIntention.paymentDate.isBefore(momentFactory_1.MomentFactory.currentDateTime());
    }
    get partAdmissionPayImmediatelyPastPaymentDate() {
        return this.response
            && this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            && (this.response.responseType === responseType_1.ResponseType.PART_ADMISSION)
            && this.response.paymentIntention
            && this.response.paymentIntention.paymentOption === paymentOption_1.PaymentOption.IMMEDIATELY
            && this.response.paymentIntention.paymentDate.isBefore(momentFactory_1.MomentFactory.currentDateTime());
    }
    get retrieveDateOfBirthOfDefendant() {
        if (this.response && this.response.defendant.type === partyType_1.PartyType.INDIVIDUAL.value) {
            const defendantDateOfBirth = momentFactory_1.MomentFactory.parse(this.response.defendant.dateOfBirth);
            return new dateOfBirth_1.DateOfBirth(true, localDate_1.LocalDate.fromMoment(defendantDateOfBirth));
        }
        return undefined;
    }
    deserialize(input) {
        if (input) {
            this.id = input.id;
            this.state = input.state;
            this.claimantId = input.submitterId;
            this.externalId = input.externalId;
            this.defendantId = input.defendantId;
            this.state = input.state;
            this.claimNumber = input.referenceNumber;
            this.createdAt = momentFactory_1.MomentFactory.parse(input.createdAt);
            this.responseDeadline = momentFactory_1.MomentFactory.parse(input.responseDeadline);
            this.issuedOn = momentFactory_1.MomentFactory.parse(input.issuedOn);
            this.claimData = new claimData_1.ClaimData().deserialize(input.claim);
            this.moreTimeRequested = input.moreTimeRequested;
            if (input.respondedAt) {
                this.respondedAt = momentFactory_1.MomentFactory.parse(input.respondedAt);
            }
            if (input.defendantEmail) {
                this.defendantEmail = input.defendantEmail;
            }
            if (input.response) {
                this.response = response_1.Response.deserialize(input.response);
            }
            this.claimantEmail = input.submitterEmail;
            this.countyCourtJudgment = new countyCourtJudgment_1.CountyCourtJudgment().deserialize(input.countyCourtJudgment);
            if (input.countyCourtJudgmentRequestedAt) {
                this.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.parse(input.countyCourtJudgmentRequestedAt);
            }
            if (input.countyCourtJudgmentIssuedAt) {
                this.countyCourtJudgmentIssuedAt = momentFactory_1.MomentFactory.parse(input.countyCourtJudgmentIssuedAt);
            }
            if (input.settlement) {
                this.settlement = new settlement_1.Settlement().deserialize(input.settlement);
            }
            if (input.settlementReachedAt) {
                this.settlementReachedAt = momentFactory_1.MomentFactory.parse(input.settlementReachedAt);
            }
            if (input.claimantResponse) {
                this.claimantResponse = claimantResponse_1.ClaimantResponse.deserialize(input.claimantResponse);
            }
            if (input.claimantRespondedAt) {
                this.claimantRespondedAt = momentFactory_1.MomentFactory.parse(input.claimantRespondedAt);
            }
            this.totalAmountTillToday = input.totalAmountTillToday;
            this.totalAmountTillDateOfIssue = input.totalAmountTillDateOfIssue;
            this.totalInterest = input.totalInterest;
            this.features = input.features;
            if (input.directionsQuestionnaireDeadline) {
                this.directionsQuestionnaireDeadline = momentFactory_1.MomentFactory.parse(input.directionsQuestionnaireDeadline);
            }
            if (input.moneyReceivedOn) {
                this.moneyReceivedOn = momentFactory_1.MomentFactory.parse(input.moneyReceivedOn);
            }
            if (input.reDetermination) {
                this.reDetermination = reDetermination_1.ReDetermination.deserialize(input.reDetermination);
            }
            if (input.reDeterminationRequestedAt) {
                this.reDeterminationRequestedAt = momentFactory_1.MomentFactory.parse(input.reDeterminationRequestedAt);
            }
            if (input.ccdCaseId) {
                this.ccdCaseId = input.ccdCaseId;
            }
            if (input.directionOrder) {
                this.directionOrder = directionOrder_1.DirectionOrder.deserialize(input.directionOrder);
            }
            if (input.reviewOrder) {
                this.reviewOrder = new reviewOrder_1.ReviewOrder().deserialize(input.reviewOrder);
            }
            this.intentionToProceedDeadline = input.intentionToProceedDeadline && momentFactory_1.MomentFactory.parse(input.intentionToProceedDeadline);
            if (input.mediationOutcome) {
                this.mediationOutcome = input.mediationOutcome;
            }
            if (input.pilotCourt) {
                this.pilotCourt = yesNoOption_1.YesNoOption.fromObject(input.pilotCourt);
            }
            if (input.paperResponse) {
                this.paperResponse = yesNoOption_1.YesNoOption.fromObject(input.paperResponse);
            }
            if (input.claimDocumentCollection && input.claimDocumentCollection.claimDocuments) {
                this.claimDocuments = _.sortBy(input.claimDocumentCollection.claimDocuments.filter(value => claimDocumentType_1.ClaimDocumentType[value.documentType] !== undefined).map((value) => {
                    return new claimDocument_1.ClaimDocument().deserialize(value);
                }), [function (o) {
                        return o.createdDatetime;
                    }]).reverse();
            }
            return this;
        }
    }
    isAdmissionsResponse() {
        return (this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION
            || this.response.responseType === responseType_1.ResponseType.PART_ADMISSION);
    }
    isResponseSubmitted() {
        return !!this.response && !this.claimantResponse;
    }
    hasDefendantNotSignedSettlementAgreementInTime() {
        return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
            this.claimantRespondedAt && this.claimantRespondedAt.clone().add('7', 'days').isBefore(momentFactory_1.MomentFactory.currentDate());
    }
    hasClaimantAcceptedAdmissionWithCCJ() {
        return this.countyCourtJudgment && this.response && this.claimantResponse && !this.isSettlementAgreementRejected &&
            !this.isSettlementReachedThroughAdmission() &&
            (this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION || this.response.responseType === responseType_1.ResponseType.PART_ADMISSION) &&
            !this.claimantResponse.courtDetermination && !this.reDeterminationRequestedAt;
    }
    hasClaimantAcceptedAdmissionWithCourtOfferWithCCJ() {
        return this.countyCourtJudgment && this.response && this.claimantResponse && !this.isSettlementReachedThroughAdmission() &&
            (this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION) &&
            this.claimantResponse.courtDetermination && !this.reDeterminationRequestedAt;
    }
    hasClaimantAcceptedDefendantResponseWithCCJ() {
        return this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            && this.countyCourtJudgmentRequestedAt !== undefined
            && this.countyCourtJudgment !== undefined;
    }
    hasClaimantAcceptedDefendantResponseWithSettlement() {
        return this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            && this.settlement !== undefined;
    }
    isEligibleForReDetermination() {
        const dateAfter19Days = this.countyCourtJudgmentRequestedAt && this.countyCourtJudgmentRequestedAt.clone().add(19, 'days');
        return this.countyCourtJudgment && this.countyCourtJudgment.ccjType === countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
            && momentFactory_1.MomentFactory.currentDateTime().isBefore(dateAfter19Days)
            && this.reDeterminationRequestedAt === undefined;
    }
    amountPaid() {
        return this.claimantResponse && this.claimantResponse.amountPaid ? this.claimantResponse.amountPaid : 0;
    }
    otherPartyName(user) {
        if (!user || !user.id) {
            throw new Error('user must be provided');
        }
        return this.claimantId === user.id ? this.claimData.defendant.name : this.claimData.claimant.name;
    }
    isPaidInFullLinkEligible() {
        if (this.moneyReceivedOn || (this.moneyReceivedOn && this.countyCourtJudgmentRequestedAt)) {
            return false;
        }
        if (this.hasClaimantAcceptedAdmissionWithCourtOfferWithCCJ()) {
            return false;
        }
        if (this.isSettlementReached()) {
            return false;
        }
        if (this.mediationOutcome !== undefined && this.mediationOutcome === mediationOutcome_1.MediationOutcome.SUCCEEDED) {
            return false;
        }
        if (this.isResponseSubmitted() && this.response.responseType === responseType_1.ResponseType.PART_ADMISSION && (this.response && !this.response.paymentDeclaration)) {
            return true;
        }
        if (this.isResponseSubmitted() && (this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE || this.response.responseType === responseType_1.ResponseType.PART_ADMISSION)) {
            return true;
        }
        if (this.isOfferAccepted() || this.hasClaimantRejectedPartAdmission() || this.hasClaimantRejectedPartAdmissionDQs() || this.hasRedeterminationBeenRequested()) {
            return true;
        }
        if (this.claimantResponse && this.claimantResponse.formaliseOption === formaliseOption_1.FormaliseOption.REFER_TO_JUDGE) {
            return true;
        }
        if (this.hasClaimantRespondedToStatesPaid()) {
            return false;
        }
        if (this.hasClaimantRejectedDefendantDefence()) {
            return true;
        }
        if (this.hasClaimantRejectedDefendantDefenceWithoutDQs()) {
            return true;
        }
        return (((this.response && this.response.paymentIntention
            && this.response.paymentIntention.paymentOption !==
                paymentOption_1.PaymentOption.IMMEDIATELY
            && !this.isSettlementReachedThroughAdmission() && this.isResponseSubmitted())
            && !(this.countyCourtJudgmentRequestedAt && this.hasClaimantAcceptedAdmissionWithCCJ()))
            || !this.response);
    }
    isDefendantBusiness() {
        return this.claimData && this.claimData.defendant && this.claimData.defendant.isBusiness();
    }
    isOfferSubmitted() {
        return this.settlement && this.response && this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE;
    }
    isOfferAccepted() {
        return this.settlement && this.settlement.isOfferAccepted();
    }
    isOfferRejected() {
        return this.settlement && this.settlement.isOfferRejected();
    }
    isSettlementReached() {
        return this.settlement && !!this.settlementReachedAt;
    }
    isCCJPaidWithinMonth() {
        return this.moneyReceivedOn.isSameOrBefore(calculateMonthIncrement_1.calculateMonthIncrement(this.countyCourtJudgmentRequestedAt));
    }
    isSettlementReachedThroughAdmission() {
        return this.settlement && !this.settlement.isOfferRejectedByDefendant() && this.settlement.isThroughAdmissionsAndSettled();
    }
    get isSettlementAgreementRejected() {
        if (!this.claimantResponse || this.claimantResponse.type !== claimantResponseType_1.ClaimantResponseType.ACCEPTATION) {
            return false;
        }
        const claimantResponse = this.claimantResponse;
        return claimantResponse.formaliseOption === formaliseOption_1.FormaliseOption.SETTLEMENT
            && this.settlement && this.settlement.isOfferRejected();
    }
    isSettlementPaymentDateValid() {
        if (this.settlement) {
            const offer = this.settlement.getLastOffer();
            const now = momentFactory_1.MomentFactory.currentDate();
            if (offer && offer.paymentIntention) {
                switch (offer.paymentIntention.paymentOption) {
                    case paymentOption_1.PaymentOption.BY_SPECIFIED_DATE:
                        const paymentDate = offer.paymentIntention.paymentDate;
                        return (paymentDate.isAfter(now) || paymentDate.isSame(now));
                    case paymentOption_1.PaymentOption.INSTALMENTS:
                        const firstPaymentDate = offer.paymentIntention.repaymentPlan.firstPaymentDate;
                        return (firstPaymentDate.isAfter(now) || firstPaymentDate.isSame(now));
                    case paymentOption_1.PaymentOption.IMMEDIATELY:
                        return true;
                }
            }
        }
        return false;
    }
    isSettlementRejectedOrBreached() {
        return ((this.settlement && (!!this.settlementReachedAt || this.settlement.isOfferRejectedByDefendant()))
            || this.hasDefendantNotSignedSettlementAgreementInTime());
    }
    hasClaimantAcceptedOfferAndSignedSettlementAgreement() {
        return this.settlement && this.settlement.isOfferAccepted() && this.settlement.isThroughAdmissions() &&
            this.claimantResponse && !this.claimantResponse.courtDetermination;
    }
    hasClaimantSignedSettlementAgreementChosenByCourt() {
        return this.settlement && this.settlement.isOfferAccepted() && !this.settlement.isOfferRejectedByDefendant() && this.settlement.isThroughAdmissions() &&
            this.claimantResponse && !!this.claimantResponse.courtDetermination;
    }
    hasClaimantRejectedDefendantResponse() {
        return !claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire') &&
            this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION;
    }
    hasClaimantAcceptedDefendantPartAdmissionResponseWithAlternativePaymentIntention() {
        return this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION &&
            this.claimantResponse.claimantPaymentIntention &&
            this.response && this.response.responseType === responseType_1.ResponseType.PART_ADMISSION;
    }
    hasClaimantAcceptedDefendantFullAdmissionResponseWithAlternativePaymentIntention() {
        return this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION &&
            this.claimantResponse.claimantPaymentIntention &&
            this.response && this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION;
    }
    isClaimantResponseSubmitted() {
        return this.response !== undefined && this.claimantResponse !== undefined;
    }
    hasClaimantSuggestedAlternativePlanWithCCJ() {
        return this.claimantResponse && this.countyCourtJudgmentRequestedAt && !this.isSettlementAgreementRejected &&
            !this.isSettlementReachedThroughAdmission() &&
            !!this.claimantResponse.courtDetermination &&
            this.claimantResponse.formaliseOption !== formaliseOption_1.FormaliseOption.SETTLEMENT &&
            !this.reDeterminationRequestedAt;
    }
    hasClaimantRequestedCCJAfterDefendantRejectsSettlementAgreement() {
        return this.claimantResponse && this.countyCourtJudgmentRequestedAt && this.isSettlementAgreementRejected &&
            this.claimantResponse.formaliseOption === formaliseOption_1.FormaliseOption.SETTLEMENT &&
            !this.reDeterminationRequestedAt;
    }
    hasRedeterminationBeenRequested() {
        return this.claimantResponse && this.countyCourtJudgmentRequestedAt && !!this.reDeterminationRequestedAt;
    }
    hasClaimantRejectedPartAdmission() {
        return !claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire') && this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION
            && this.response.responseType === responseType_1.ResponseType.PART_ADMISSION;
    }
    hasClaimantRejectedPartAdmissionDQs() {
        return claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire') && this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION
            && this.response.responseType === responseType_1.ResponseType.PART_ADMISSION;
    }
    hasCCJBeenRequestedAfterSettlementBreached() {
        return this.isSettlementReachedThroughAdmission() && !!this.countyCourtJudgmentRequestedAt && !this.claimantResponse.courtDetermination;
    }
    hasCCJByDeterminationBeenRequestedAfterSettlementBreached() {
        return this.isSettlementReachedThroughAdmission() &&
            !this.isSettlementAgreementRejected &&
            !!this.countyCourtJudgmentRequestedAt && !!this.claimantResponse.courtDetermination;
    }
    hasClaimantAcceptedPartAdmitPayImmediately() {
        return this.claimantResponse && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION &&
            this.response.responseType === responseType_1.ResponseType.PART_ADMISSION && !this.response.paymentDeclaration &&
            this.response.paymentIntention.paymentOption === paymentOption_1.PaymentOption.IMMEDIATELY;
    }
    hasClaimantAcceptedStatesPaid() {
        return this.hasClaimantRespondedToStatesPaid() && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION;
    }
    hasClaimantRespondedToStatesPaid() {
        return !!this.claimantResponse && !!this.claimantResponse.type &&
            ((this.response.responseType === responseType_1.ResponseType.PART_ADMISSION && this.response.paymentDeclaration !== undefined)
                || (this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && this.response.defenceType === defenceType_1.DefenceType.ALREADY_PAID && this.response.paymentDeclaration !== undefined));
    }
    hasClaimantRejectedStatesPaid() {
        return this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION
            && ((this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && this.response.defenceType === defenceType_1.DefenceType.ALREADY_PAID)
                || this.response.responseType === responseType_1.ResponseType.PART_ADMISSION)
            && this.response.paymentDeclaration !== undefined;
    }
    hasClaimantRejectedDefendantDefence() {
        return claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire') && this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION
            && (this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && this.response.defenceType === defenceType_1.DefenceType.DISPUTE);
    }
    hasClaimantRejectedDefendantDefenceWithoutDQs() {
        return !claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire') && this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION
            && (this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && this.response.defenceType === defenceType_1.DefenceType.DISPUTE);
    }
    isInterlocutoryJudgmentRequestedOnAdmissions() {
        return this.response
            && (this.response.responseType === responseType_1.ResponseType.FULL_ADMISSION
                || this.response.responseType === responseType_1.ResponseType.PART_ADMISSION)
            && this.claimantResponse
            && this.claimantResponse.formaliseOption === formaliseOption_1.FormaliseOption.REFER_TO_JUDGE;
    }
    hasClaimantAcceptedDefendantDefence() {
        return this.claimantResponse
            && this.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            && (this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && this.response.defenceType === defenceType_1.DefenceType.DISPUTE);
    }
    hasDefendantRejectedClaimWithDQs() {
        return claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(this, 'directionsQuestionnaire')
            && this.isResponseSubmitted()
            && this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE;
    }
    hasOrderBeenDrawn() {
        return !!this.directionOrder;
    }
    isIntentionToProceedEligible() {
        const dateIntentionToProceedWasReleased = momentFactory_1.MomentFactory.parse('2019-09-09').hour(15).minute(12);
        return this.createdAt.isAfter(dateIntentionToProceedWasReleased);
    }
    hasIntentionToProceedDeadlinePassed() {
        return !this.claimantResponse && this.response && this.response.responseType === responseType_1.ResponseType.FULL_DEFENCE && momentFactory_1.MomentFactory.currentDateTime().isAfter(this.intentionToProceedDeadline.clone().hour(16)) &&
            this.isIntentionToProceedEligible();
    }
}
exports.Claim = Claim;
