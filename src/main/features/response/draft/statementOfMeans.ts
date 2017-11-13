import { Serializable } from 'models/serializable'
import { Residence } from 'response/form/models/statement-of-means/residence'

export class StatementOfMeans implements Serializable<StatementOfMeans> {
  residence?: Residence

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
    }
    return this
  }
}
