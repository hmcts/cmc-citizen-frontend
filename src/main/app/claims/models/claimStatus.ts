export enum ClaimStatus {
  NO_RESPONSE,
  MORE_TIME_REQUESTED,
  ELIGIBLE_FOR_CCJ,
  CCJ_REQUESTED,
  RESPONSE_SUBMITTED,
  OFFER_SUBMITTED,
  OFFER_ACCEPTED,
  OFFER_REJECTED,
  OFFER_SETTLEMENT_REACHED,
  SETTLEMENT_AGREEMENT_REJECTED,
  PAID_IN_FULL_LINK_ELIGIBLE,
  PAID_IN_FULL,
  PAID_IN_FULL_CCJ_CANCELLED,
  PAID_IN_FULL_CCJ_SATISFIED,
  ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT,
  ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE,
  ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE,
  CLAIMANT_ACCEPTED_ADMISSION,
  CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED,
  CLAIMANT_ACCEPTED_ADMISSION_AND_REQUESTED_CCJ,
  ADMISSION_SETTLEMENT_AGREEMENT_REACHED,
  CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE,
  CLAIMANT_ACCEPTED_DEFENDANT_FULL_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE,
  CLAIMANT_ACCEPTED_DEFENDANT_PART_ADMISSION_AS_BUSINESS_WITH_ALTERNATIVE_PAYMENT_INTENTION_RESPONSE,
  CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT,
  CLAIMANT_ACCEPTED_STATES_PAID,
  CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ,
  CLAIMANT_REJECTED_PART_ADMISSION,
  CLAIMANT_REJECTED_STATES_PAID,
  REDETERMINATION_BY_JUDGE,
  CCJ_AFTER_SETTLEMENT_BREACHED,
  CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED,
  PART_ADMIT_PAY_IMMEDIATELY,
  // TODO: precise response to be worked out
  CLAIMANT_RESPONSE_SUBMITTED,
  CLAIMANT_REJECTED_DEFENDANT_DEFENCE,
  CLAIMANT_ACCEPTED_DEFENDANT_DEFENCE,
  CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ,
  CLAIMANT_ACCEPTED_DEFENDANT_DEFENCE_NO_DQ,
  DEFENDANT_REJECTS_WITH_DQS,
  CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT,
  ORDER_DRAWN,
  REVIEW_ORDER_REQUESTED
}
