import { Serializable } from 'models/serializable'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { Dependants } from 'response/form/models/statement-of-means/dependants'

export class StatementOfMeans implements Serializable<StatementOfMeans> {
  residence?: Residence
  dependants?: Dependants
  employment?: Employment
  employers?: Employers
  selfEmployed?: SelfEmployed

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.dependants = new Dependants().deserialize(input.dependants)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployed = new SelfEmployed().deserialize(input.selfEmployed)
    }
    return this
  }
}
