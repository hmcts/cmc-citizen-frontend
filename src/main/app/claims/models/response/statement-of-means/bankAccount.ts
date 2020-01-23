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
