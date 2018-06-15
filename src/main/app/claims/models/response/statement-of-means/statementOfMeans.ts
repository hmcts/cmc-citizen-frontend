
export enum ResidenceType {
  OWN_HOME = 'OWN_HOME',
  JOINT_OWN_HOME = 'JOINT_OWN_HOME',
  PRIVATE_RENTAL = 'PRIVATE_RENTAL',
  COUNCIL_OR_HOUSING_ASSN_HOME = 'COUNCIL_OR_HOUSING_ASSN_HOME',
  OTHER = 'OTHER'
}

export interface Residence {
  type: ResidenceType
  otherDetail: string
}

export enum AgeGroupType {
  UNDER_11 = 'UNDER_11',
  BETWEEN_11_AND_15 = 'BETWEEN_11_AND_15',
  BETWEEN_16_AND_19 = 'BETWEEN_16_AND_19'
}

export interface Child {
  ageGroupType: AgeGroupType
  numberOfChildren: number
  numberOfChildrenLivingWithYou?: number
}

export interface OtherDependants {
  numberOfPeople: number
  details: string
}

export interface Dependant {
  children: Child[]
  numberOfMaintainedChildren: number
  otherDependants: OtherDependants
}

export enum BankAccountType {
  CURRENT_ACCOUNT = 'CURRENT_ACCOUNT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  ISA = 'ISA',
  OTHER = 'OTHER'
}

export interface BankAccount {
  type: BankAccountType
  joint: boolean
  balance: number
}

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

export enum IncomeType {
  JOB = 'JOB',
  UNIVERSAL_CREDIT = 'UNIVERSAL_CREDIT',
  JOB_SEEKERS_ALLOWANCE_INCOME_BASES = 'JOB_SEEKERS_ALLOWANCE_INCOME_BASES',
  JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED = 'JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED',
  INCOME_SUPPORT = 'INCOME_SUPPORT',
  WORKING_TAX_CREDIT = 'WORKING_TAX_CREDIT',
  CHILD_TAX_CREDIT = 'CHILD_TAX_CREDIT',
  CHILD_BENEFIT = 'CHILD_BENEFIT',
  COUNCIL_TAX_SUPPORT = 'COUNCIL_TAX_SUPPORT',
  PENSION = 'PENSION',
  OTHER = 'OTHER'
}

export enum PaymentFrequency {
  WEEK = 'WEEK',
  TWO_WEEKS = 'TWO_WEEKS',
  FOUR_WEEKS = 'FOUR_WEEKS',
  MONTH = 'MONTH'
}

export interface Income {
  type: IncomeType
  otherSource: string
  frequency: PaymentFrequency
  amountReceived: number
}

export enum ExpenseType {
  MORTGAGE = 'MORTGAGE',
  RENT = 'RENT',
  COUNCIL_TAX = 'COUNCIL_TAX',
  GAS = 'GAS',
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  TRAVEL = 'TRAVEL',
  SCHOOL_COSTS = 'SCHOOL_COSTS',
  FOOD_HOUSEKEEPING = 'FOOD_HOUSEKEEPING',
  TV_AND_BROADBAND = 'TV_AND_BROADBAND',
  HIRE_PURCHASES = 'HIRE_PURCHASES',
  MOBILE_PHONE = 'MOBILE_PHONE',
  MAINTENANCE_PAYMENTS = 'MAINTENANCE_PAYMENTS',
  OTHER = 'OTHER'
}

export interface Expense {
  type: ExpenseType
  otherSource: string
  frequency: PaymentFrequency
  amountReceived: number
}

export interface Debt {
  description: string
  totalOwed: number
  monthlyPayments: number
}

export interface CourtOrder {
  claimNumber: string
  amountOwed: number
  monthlyInstalmentAmount: number
}

export interface StatementOfMeans {
  bankAccounts: BankAccount[]
  residence?: Residence
  dependant?: Dependant
  employment?: Employment
  incomes?: Income[]
  expenses?: Expense[]
  debts?: Debt[]
  courtOrders?: CourtOrder[]
  reason?: string
}
