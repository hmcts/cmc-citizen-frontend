export enum InitialStates {
  INIT = 'init',
  NO_RESPONSE = 'no-response',
  MORE_TIME_REQUESTED = 'more-time-requested',
  NO_RESPONSE_PAST_DEADLINE = 'no-response-past-deadline',
  HWF_APPLICATION_PENDING = 'help-with-fees',
  HWF_INVALID_REFERENCE = 'help-with-fees-invalid',
  HWF_AWAITING_RESPONSE_HWF = 'awaiting_response_hwf',
  HWF_Rejected = 'help-with-fees-rejected',
  HWF_More_Info = 'help-with-fess-more-info-required',
  HWF_Part_Remitted = 'help-with-fess-part-remittion-granted',
  HWF_CLOSED = 'help-with-fess-closed',
  HWF_Intrest_Recalculate = 'help-with-fess-intrest-recalculated'
}
