import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { Education } from 'response/form/models/statement-of-means/education'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { SupportedByYou } from 'response/form/models/statement-of-means/supportedByYou'
import { Unemployed } from 'response/form/models/statement-of-means/unemployed'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'
import { FeatureToggles } from 'utils/featureToggles'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'

export class StatementOfMeans {
  residence?: Residence
  dependants?: Dependants
  maintenance?: Maintenance
  supportedByYou?: SupportedByYou
  education?: Education
  employment?: Employment
  employers?: Employers
  selfEmployed?: SelfEmployed
  unemployed?: Unemployed
  bankAccounts?: BankAccounts
  debts?: Debts
  monthlyIncome?: MonthlyIncome
  monthlyExpenses?: MonthlyExpenses
  courtOrders?: CourtOrders

  static isApplicableFor (responseDraft?: ResponseDraft): boolean {
    if (!FeatureToggles.isEnabled('statementOfMeans')) {
      return false
    }
    if (!responseDraft) {
      throw new Error('Response draft has to be provided as input')
    }
    return !responseDraft.defendantDetails.partyDetails.isBusiness()
      && this.isResponseApplicable(responseDraft)
  }

  private static isResponseApplicable (responseDraft: ResponseDraft) {
    return (responseDraft.response.type === ResponseType.FULL_ADMISSION
      && !responseDraft.fullAdmission.paymentOption.isOfType(DefendantPaymentType.IMMEDIATELY))
  }

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.dependants = new Dependants().deserialize(input.dependants)
      this.education = new Education().deserialize(input.education)
      this.maintenance = new Maintenance().deserialize(input.maintenance)
      this.supportedByYou = new SupportedByYou().deserialize(input.supportedByYou)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployed = new SelfEmployed().deserialize(input.selfEmployed)
      this.unemployed = new Unemployed().deserialize(input.unemployed)
      this.bankAccounts = new BankAccounts().deserialize(input.bankAccounts)
      this.debts = new Debts().deserialize(input.debts)
      this.monthlyIncome = new MonthlyIncome().deserialize(input.monthlyIncome)
      this.monthlyExpenses = new MonthlyExpenses().deserialize(input.monthlyExpenses)
      this.courtOrders = new CourtOrders().deserialize(input.courtOrders)
    }
    return this
  }
}
