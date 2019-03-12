import { IsDefined } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'
import * as toBoolean from 'to-boolean'

export class SelfWitness implements CompletableTask {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  selfWitness: boolean

  constructor (selfWitness?: boolean) {
    this.selfWitness = selfWitness
  }

  static fromObject (value?: any): SelfWitness {
    if (!value) {
      return value
    }

    return new SelfWitness(value.selfWitness !== undefined ? toBoolean(value.selfWitness) === true : undefined)
  }

  deserialize (input?: any): SelfWitness {
    if (input) {
      this.selfWitness = input.selfWitness
    }
    return this
  }

  isCompleted (): boolean {
    return this.selfWitness !== undefined
  }
}
