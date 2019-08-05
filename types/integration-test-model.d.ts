declare type User = {
  id?: string
  bearerToken: string
}

declare type ClaimData = {
  claimants: Party[]
  defendants: Party[]
  feeAmountInPennies: number
  amount: Amount
  interest: Interest,
  reason: string
  payment: Payment,
  total: number,
  externalId: string
  moneyReceivedOn: moment
}

declare type Claim = {
  id: number
  referenceNumber: string
  externalId: string
  letterHolderId: string
}

declare type Party = {
  type: string
  name: string
  title?: string
  firstName?: string
  lastName?: string
  contactPerson?: string
  address: Address
  correspondenceAddress?: Address
  phone?: string
  email?: string
  dateOfBirth?: string
}

declare type Address = {
  line1: string
  line2?: string
  city?: string
  postcode: string
}

declare type Amount = {
  type: string
  rows: AmountBreakdown[],
  getClaimTotal: () => number
  getTotal: () => number
}

declare type AmountBreakdown = {
  amount: number
  reason: string
}

declare type Interest = {
  type: string
  rate?: number
  interestBreakdown?: InterestBreakdown
  specificDailyAmount?: number,
  interestDate?: InterestDate
}

declare type InterestBreakdown = {
  totalAmount?: number
  explanation?: string
}

declare type InterestDate = {
  type?: string
  endDateType?: string
}

declare type Payment = {
  amount: number
  reference: string
  status: string
}

declare type ResponseData = {
  responseType: 'FULL_DEFENCE'
  defenceType: 'DISPUTE'
  defendant: Party
  moreTimeNeeded: string
  freeMediation: string
  defence: string
}

declare type PartialDefence = {
  paidWhatIBelieveIOwe: PaidWhatIBeliveIOweDefence
  claimAmountIsTooMuch: ClaimAmountIsTooHighDefence
  timeline: Timeline
  impactOfDispute: string
}

declare type PaidWhatIBeliveIOweDefence = {
  howMuchAlreadyPaid: number
  paidDate: string
  explanation: string
}

declare type ClaimAmountIsTooHighDefence = {
  howMuchIBelieveIOwe: number
  explanation: string
}

declare type Timeline = {
  events: TimelineEvent[]
}

declare type TimelineEvent = {
  date: string
  description: string
}

declare type PaymentPlan = {
  equalInstalment: number,
  firstPaymentDate: string,
  frequency: string
}

declare type Offer = {
  offerText: string,
  completionDate: string
}

declare type CardDetails = {
  number: number
  expiryMonth: string
  expiryYear: string
  name: string,
  verificationCode: string
}

declare type PostcodeLookupQuery = {
  postcode: string,
  address: string
}
