import { Person } from 'app/claims/models/person'

export class Defendant extends Person {
  email?: string

  deserialize (input: any): Defendant {
    if (input) {
      Object.assign(this, new Person().deserialize(input))
      if (input.email) {
        this.email = input.email
      }
    }
    return this
  }
}
