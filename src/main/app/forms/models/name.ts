import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { CompletableTask } from 'app/models/task'

export class ValidationErrors {
  static readonly NAME_REQUIRED: string = 'Enter name'
  static readonly NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export class Name implements Serializable<Name>, CompletableTask {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG })
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (input?: any): Name {
    return new Name(input.name)
  }

  deserialize (input?: any): Name {
    if (input) {
      this.name = input.name
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.name
  }
}
