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
  ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT,
  ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE,
  CLAIMANT_ACCEPTED_ADMISSION,
  CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED,
  CLAIMANT_ACCEPTED_ADMISSION_AND_REQUESTED_CCJ,
  ADMISSION_SETTLEMENT_AGREEMENT_REACHED,
  CLAIMANT_REJECTED_DEFENDANT_AS_COMPANY_OR_ORGANISATION_RESPONSE,
  CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT,
  CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ,
  CLAIMANT_REJECTS_PART_ADMISSION,
  REDETERMINATION_BY_JUDGE,
  CCJ_AFTER_SETTLEMENT_BREACHED,
  PART_ADMIT_PAY_IMMEDIATELY,
  // TODO: precise response to be worked out
  CLAIMANT_RESPONSE_SUBMITTED
}
