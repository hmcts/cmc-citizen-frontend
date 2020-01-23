export interface Employer {
  jobTitle: string
  name: string
}

export interface OnTaxPayments {
  amountYouOwe: number
  reason: string
}

export interface SelfEmployment {
  jobTitle: string
  annualTurnover: number
  onTaxPayments: OnTaxPayments
}

export interface Unemployed {
  numberOfYears: number
  numberOfMonths: number
}

export interface Unemployment {
  unemployed: Unemployed
  retired: boolean
  other: string
}

export interface Employment {
  employers?: Employer[]
  selfEmployment?: SelfEmployment
  unemployment?: Unemployment
}
