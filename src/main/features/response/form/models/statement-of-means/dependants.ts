import { IsDefined, IsInt, Min, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import * as _ from 'lodash'
import * as toBoolean from 'to-boolean'

export class ValidationErrors {
  static readonly HAS_ANY_CHILDREN_NOT_SELECTED: string = 'Select an option'
  static readonly INVALID_NUMBER_OF_CHILDREN: string = 'Enter a valid number'
  static readonly UNDER_11_REQUIRED: string = 'Enter a number of children under 11'
  static readonly BETWEEN_11_AND_15_REQUIRED: string = 'Enter a number of children between 11 and 15'
  static readonly BETWEEN_16_AND_19_REQUIRED: string = 'Enter a number of children between 19 and 19'
}

export class Dependants implements Serializable<Dependants> {

  @IsDefined({ message: ValidationErrors.HAS_ANY_CHILDREN_NOT_SELECTED })
  hasAnyChildren: boolean

  @ValidateIf(o => o.hasAnyChildren === true)
  @IsDefined({ message: ValidationErrors.UNDER_11_REQUIRED })
  @IsInt({ message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  @Min(0, { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  under11: number

  @ValidateIf(o => o.hasAnyChildren === true)
  @IsDefined({ message: ValidationErrors.BETWEEN_11_AND_15_REQUIRED })
  @IsInt({ message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  @Min(0, { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  between11and15: number

  @ValidateIf(o => o.hasAnyChildren === true)
  @IsDefined({ message: ValidationErrors.BETWEEN_16_AND_19_REQUIRED })
  @IsInt({ message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  @Min(0, { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  between16and19: number

  constructor (hasAnyChildren?: boolean, under11?: number, between11and15?: number, between16and19?: number) {
    this.hasAnyChildren = hasAnyChildren
    this.under11 = under11 !== undefined ? _.toNumber(under11) : undefined
    this.between11and15 = between11and15 !== undefined ? _.toNumber(between11and15) : undefined
    this.between16and19 = between16and19 !== undefined ? _.toNumber(between16and19) : undefined
  }

  static fromObject (value?: any): Dependants {
    if (!value) {
      return value
    }

    const dependants = new Dependants(
      value.hasAnyChildren !== undefined ? toBoolean(value.hasAnyChildren) === true : undefined,
      value.under11,
      value.between11and15,
      value.between16and19
    )

    if (!dependants.hasAnyChildren) {
      dependants.under11 = dependants.between11and15 = dependants.between16and19 = undefined
    }

    return dependants
  }

  deserialize (input?: any): Dependants {
    if (input) {
      this.hasAnyChildren = input.hasAnyChildren
      if (this.hasAnyChildren) {
        this.under11 = input.under11
        this.between11and15 = input.between11and15
        this.between16and19 = input.between16and19
      }
    }
    return this
  }
}
