import { Serializable } from 'models/serializable'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'

export class StatementOfMeans implements Serializable<StatementOfMeans> {
  residence?: Residence
  employment?: Employment
  employers?: Employers
  selfEmployed?: SelfEmployed

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployed = new SelfEmployed().deserialize(input.selfEmployed)
    }
    return this
  }
}
