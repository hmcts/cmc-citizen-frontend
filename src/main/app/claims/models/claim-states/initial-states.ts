export enum InitialStates {
  INIT = 'init',
  NO_RESPONSE = 'no-response',
  MORE_TIME_REQUESTED = 'more-time-requested',
  NO_RESPONSE_PAST_DEADLINE = 'no-response-past-deadline',
  HWF_APPLICATION_PENDING = 'help-with-fees',
  HWF_INVALID_REFERENCE = 'help-with-fees-invalid',
  HWF_AWAITING_RESPONSE_HWF = 'awaiting_response_hwf',
  HWF_Rejected = 'help-with-fees-rejected',
  HWF_FEES_REQUIREMENT_NOT_MET = 'fees_requirement_not_met',
  HWF_NOT_QUALIFY_FEE_ASSISTANCE ='not_qualify_fee_assistance',
  HWF_INCORRECT_EVIDENCE = 'incorrect_evidence',
  HWF_INSUFFICIENT_EVIDENCE='insufficient_evidence'
}
