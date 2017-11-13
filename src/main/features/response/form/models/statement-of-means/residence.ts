import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { Serializable } from 'models/serializable'
import { IsDefined, IsIn, MaxLength, ValidateIf } from 'class-validator'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly DESCRIBE_YOUR_HOUSING: string = 'Describe your housing'
}

export class Residence implements Serializable<Residence> {
  @IsDefined({ message: DefaultValidationErrors.SELECT_AN_OPTION })
  @IsIn(ResidenceType.all(), { message: DefaultValidationErrors.SELECT_AN_OPTION })
  type?: ResidenceType

  @ValidateIf(o => o.type && o.type.value === ResidenceType.OTHER.value)
  @IsDefined({ message: ValidationErrors.DESCRIBE_YOUR_HOUSING })
  @IsNotBlank({ message: ValidationErrors.DESCRIBE_YOUR_HOUSING })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.FREE_TEXT_TOO_LONG })
  housingDetails?: string

  constructor (type?: ResidenceType, otherTypeDetails?: string) {
    this.type = type
    this.housingDetails = otherTypeDetails
  }

  static fromObject (input?: any) {
    if (!input) {
      return input
    }
    const type: ResidenceType = ResidenceType.valueOf(input.type)
    return new Residence(
      type,
      (type && type.value === ResidenceType.OTHER.value) ? input.housingDetails : undefined
    )
  }

  deserialize (input: any): Residence {
    if (input) {
      this.type = input.type
      this.housingDetails = input.housingDetails
    }
    return this
  }
}
