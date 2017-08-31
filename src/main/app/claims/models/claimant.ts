import { Person } from 'claims/models/person'

export class Claimant extends Person {
  deserialize (input: any): Claimant {
    if (input) {
      Object.assign(this, new Person().deserialize(input))
    }
    return this
  }
}
