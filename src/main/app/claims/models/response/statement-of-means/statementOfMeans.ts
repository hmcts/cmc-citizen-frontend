import { BankAccount } from 'claims/models/response/statement-of-means/bankAccount'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { PriorityDebts } from 'claims/models/response/statement-of-means/priorityDebts'
import { Dependant } from 'claims/models/response/statement-of-means/dependant'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Residence } from 'claims/models/response/statement-of-means/residence'
import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'
import { Partner } from 'claims/models/response/statement-of-means/partner'

export interface StatementOfMeans {
  bankAccounts: BankAccount[]
  residence?: Residence
  dependant?: Dependant
  employment?: Employment
  incomes?: Income[]
  expenses?: Expense[]
  debts?: Debt[]
  priorityDebts?: PriorityDebts[]
  courtOrders?: CourtOrder[]
  partner?: Partner
  disability?: DisabilityStatus
  carer?: boolean
  reason?: string
}
