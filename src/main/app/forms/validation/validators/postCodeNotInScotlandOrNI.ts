import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "@hmcts/class-validator"
import { ValidationErrors } from "forms/models/address"

@ValidatorConstraint({ name: 'postcodeNotInScotlandOrNI', async: false })
export class PostcodeNotInScotlandOrNIValidator implements ValidatorConstraintInterface {
  validate (value: any, args: ValidationArguments) {
    const postcode: string = value

    if (!postcode || !postcode.startsWith) {
      return false
    }
    const ukPostcodeRegex = /^[A-Za-z]{1,2}\d{1,2}\s?\d[A-Za-z]{2}$/
    const isValidFormat = ukPostcodeRegex.test(postcode)

    if (!isValidFormat) {
      return false
    }
    const scotlandPrefixes: string[] = ['KW', 'IV', 'HS', 'PH', 'AB', 'DD', 'KY', 'FK', 'EH', 'G', 'KA', 'ML', 'PA', 'TD', 'DG', 'ZE']
    const isScotlandPostcode: boolean = scotlandPrefixes.some(prefix => postcode.startsWith(prefix))
    const isNIPostcode: boolean = postcode.startsWith('BT')
    return !isScotlandPostcode && !isNIPostcode
  }

  defaultMessage (args: ValidationArguments) {
    return ValidationErrors.POSTCODE_NOT_IN_UK
  }
}
