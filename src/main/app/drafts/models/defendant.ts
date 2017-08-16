import Person from 'app/drafts/models/person'
import Email from 'app/forms/models/email'

export class Defendant extends Person {
  email?: Email

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
