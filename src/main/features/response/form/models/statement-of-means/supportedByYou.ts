import { IsDefined, ValidateIf, ValidateNested } from 'class-validator'

import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfPeople } from 'response/form/models/statement-of-means/numberOfPeople'

export class SupportedByYou {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  doYouSupportAnyone: boolean

  @ValidateIf(o => o.doYouSupportAnyone === true)
  @ValidateNested()
  numberOfPeople: NumberOfPeople

  constructor (doYouSupportAnyone?: boolean, numberOfPeople?: NumberOfPeople) {
    this.doYouSupportAnyone = doYouSupportAnyone
    this.numberOfPeople = numberOfPeople
  }

  static fromObject (value?: any): SupportedByYou {
    if (!value) {
      return value
    }

    const doYouSupportAnyone: boolean = value.doYouSupportAnyone !== undefined ?
      toBoolean(value.doYouSupportAnyone) : undefined

    return new SupportedByYou(
      doYouSupportAnyone,
      doYouSupportAnyone ? NumberOfPeople.fromObject(value.numberOfPeople) : undefined
    )
  }

  deserialize (input?: any): SupportedByYou {
    if (input) {
      this.doYouSupportAnyone = input.doYouSupportAnyone
      if (this.doYouSupportAnyone) {
        this.numberOfPeople = new NumberOfPeople().deserialize(input.numberOfPeople)
      }
    }
    return this
  }
}
