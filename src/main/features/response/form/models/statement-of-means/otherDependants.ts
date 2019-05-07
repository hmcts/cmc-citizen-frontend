import { IsDefined, ValidateIf, ValidateNested } from '@hmcts/class-validator'

import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfPeople } from 'response/form/models/statement-of-means/numberOfPeople'

export class OtherDependants {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @ValidateNested()
  numberOfPeople: NumberOfPeople

  constructor (declared?: boolean, numberOfPeople?: NumberOfPeople) {
    this.declared = declared
    this.numberOfPeople = numberOfPeople
  }

  static fromObject (value?: any): OtherDependants {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ?
      toBoolean(value.declared) : undefined

    return new OtherDependants(
      declared,
      declared ? NumberOfPeople.fromObject(value.numberOfPeople) : undefined
    )
  }

  deserialize (input?: any): OtherDependants {
    if (input) {
      this.declared = input.declared
      if (this.declared) {
        this.numberOfPeople = new NumberOfPeople().deserialize(input.numberOfPeople)
      }
    }
    return this
  }
}
