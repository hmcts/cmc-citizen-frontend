import { BankAccount } from 'claims/models/response/statement-of-means/bankAccount'
import { CourtOrder } from 'claims/models/response/statement-of-means/courtOrder'
import { Debt } from 'claims/models/response/statement-of-means/debt'
import { Dependant } from 'claims/models/response/statement-of-means/dependant'
import { Employment } from 'claims/models/response/statement-of-means/employment'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Residence } from 'claims/models/response/statement-of-means/residence'

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
