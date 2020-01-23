import { IsDefined, IsIn } from '@hmcts/class-validator'
import { ResponseType } from 'response/form/models/responseType'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose your response'
}

export class Response {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(ResponseType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: ResponseType

  constructor (type?: ResponseType) {
    this.type = type
  }

  static fromObject (value?: any): Response {
    if (value && value.type) {
      const responseType = ResponseType.all()
        .filter(type => type.value === value.type.value)
        .pop()

      return new Response(responseType)
    } else {
      return new Response()
    }
  }
}
