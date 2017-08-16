import { Person } from 'app/claims/models/person'
import Email from 'app/forms/models/email'

export class Defendant extends Person {
  email?: Email = new Email()

  deserialize (input: any): Defendant {
    if (input) {
      Object.assign(this, new Person().deserialize(input))
      if (input.email) {
        this.email = new Email().deserialize(input.email)
      }
    }
    return this
  }
}
