import { ValidationErrors } from 'forms/validation/validationErrors'
import { IsIn } from '@hmcts/class-validator'
import { Service } from 'models/service'

export class NoClaimNumber {

  @IsIn(Service.all(), { message: ValidationErrors.SELECT_AN_OPTION })
  service?: Service

  constructor (service: Service) {
    this.service = service
  }

  static fromObject (object: any): NoClaimNumber {
    return new NoClaimNumber(Service.fromObject(object.service))
  }
}
