import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "@hmcts/class-validator"
import { ValidationErrors } from "forms/models/address"

@ValidatorConstraint({ name: 'postcodeNotInScotlandOrNI', async: false })
export class PostcodeNotInScotlandOrNIValidator implements ValidatorConstraintInterface {
  validate (value: any, args: ValidationArguments) {
    const postcode: string = value

    const scotlandPrefixes: string[] = ['KW', 'IV', 'HS', 'PH', 'AB', 'DD', 'KY', 'FK', 'EH', 'G', 'KA', 'ML', 'PA', 'TD', 'DG', 'ZE']
    const isScotlandPostcode: boolean = scotlandPrefixes.some(prefix => postcode.startsWith(prefix))
    const isNIPostcode: boolean = postcode.startsWith('BT')
    return !isScotlandPostcode && !isNIPostcode
  }

  defaultMessage (args: ValidationArguments) {
    return ValidationErrors.POSTCODE_NOT_IN_UK
  }
}
