import { Serializable } from 'models/serializable'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { Education } from 'response/form/models/statement-of-means/education'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'

export class StatementOfMeans implements Serializable<StatementOfMeans> {
  residence?: Residence
  dependants?: Dependants
  maintenance?: Maintenance
  education?: Education
  employment?: Employment
  employers?: Employers
  selfEmployed?: SelfEmployed
  bankAccounts?: BankAccounts

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.dependants = new Dependants().deserialize(input.dependants)
      this.education = new Education().deserialize(input.education)
      this.maintenance = new Maintenance().deserialize(input.maintenance)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployed = new SelfEmployed().deserialize(input.selfEmployed)
      this.bankAccounts = new BankAccounts().deserialize(input.bankAccounts)
    }
    return this
  }
}
