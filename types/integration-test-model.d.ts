declare type User = {
  id: string
  bearerToken: string
}

declare type ClaimData = {
  claimants: Party[]
  defendants: Party[]
  feeAmountInPennies: number
  amount: Amount
  interest: Interest
  interestDate?: InterestDate
  reason: string
  payment: Payment
}

declare type Claim = {
  id: number
  referenceNumber: string
  externalId: string
}

declare type Party = {
  type: string
  name: string
  contactPerson?: string
  address: Address
  correspondenceAddress?: Address
  mobilePhone?: string
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
}

declare type InterestDate = {
  type: string
}

declare type Payment = {
  id: string
  amount: number
  reference: string
  description: string
  date_created: string
  state: PaymentState
}

declare type PaymentState = {
  status: string
  finished: boolean
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
  explanation: stirng
}

declare type Timeline = {
  events: TimelineEvent[]
}

declare type TimelineEvent = {
  date: string
  description: string
}

declare type PaymentPlan = {
  firstPayment: number,
  equalInstalment: number,
  firstPaymentDate: string,
  frequency: 'everyWeek'
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
