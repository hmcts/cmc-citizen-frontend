export interface BaseParameters {
  serviceId: string,
  actor: string,
  pcqId: string,
  ccdCaseId?: string,
  partyId: string,
  returnUrl: string,
  language?: string
}
export interface InvokingParameters extends BaseParameters {
  token: string
}
