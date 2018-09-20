import { OnTaxPayments } from 'response/form/models/statement-of-means/onTaxPayments'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployment } from 'response/form/models/statement-of-means/selfEmployment'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { Education } from 'response/form/models/statement-of-means/education'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { OtherDependants } from 'response/form/models/statement-of-means/otherDependants'
import { Unemployment } from 'response/form/models/statement-of-means/unemployment'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { Explanation } from 'response/form/models/statement-of-means/explanation'
import { Disability } from 'response/form/models/statement-of-means/disability'
import { SevereDisability } from 'response/form/models/statement-of-means/severeDisability'
import { Cohabiting } from 'response/form/models/statement-of-means/cohabiting'
import { PartnerAge } from 'response/form/models/statement-of-means/partnerAge'
import { PartnerPension } from 'response/form/models/statement-of-means/partnerPension'

export class StatementOfMeans {
  residence?: Residence
  dependants?: Dependants
  maintenance?: Maintenance
  otherDependants?: OtherDependants
  education?: Education
  employment?: Employment
  employers?: Employers
  selfEmployment?: SelfEmployment
  onTaxPayments?: OnTaxPayments
  unemployment?: Unemployment
  bankAccounts?: BankAccounts
  debts?: Debts
  monthlyIncome?: MonthlyIncome
  monthlyExpenses?: MonthlyExpenses
  courtOrders?: CourtOrders
  explanation?: Explanation
  disability?: Disability
  severeDisability?: SevereDisability
  cohabiting?: Cohabiting
  partnerAge?: PartnerAge
  partnerPension?: PartnerPension

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.dependants = new Dependants().deserialize(input.dependants)
      this.education = new Education().deserialize(input.education)
      this.maintenance = new Maintenance().deserialize(input.maintenance)
      this.otherDependants = new OtherDependants().deserialize(input.otherDependants)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployment = new SelfEmployment().deserialize(input.selfEmployment)
      this.onTaxPayments = new OnTaxPayments().deserialize(input.onTaxPayments)
      this.unemployment = new Unemployment().deserialize(input.unemployment)
      this.bankAccounts = new BankAccounts().deserialize(input.bankAccounts)
      this.debts = new Debts().deserialize(input.debts)
      this.monthlyIncome = new MonthlyIncome().deserialize(input.monthlyIncome)
      this.monthlyExpenses = new MonthlyExpenses().deserialize(input.monthlyExpenses)
      this.courtOrders = new CourtOrders().deserialize(input.courtOrders)
      this.explanation = new Explanation().deserialize(input.explanation)
      this.disability = new Disability().deserialize(input.disability)
      this.severeDisability = new SevereDisability().deserialize(input.severeDisability)
      this.cohabiting = new Cohabiting().deserialize(input.cohabiting)
      this.partnerAge = new PartnerAge().deserialize(input.partnerAge)
      this.partnerPension = new PartnerPension().deserialize(input.partnerPension)
    }
    return this
  }
}
