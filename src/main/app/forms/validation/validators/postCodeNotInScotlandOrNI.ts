import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "@hmcts/class-validator"
import { ValidationErrors } from "forms/models/address"

@ValidatorConstraint({ name: 'postcodeNotInScotlandOrNI', async: false })
export class PostcodeNotInScotlandOrNIValidator implements ValidatorConstraintInterface {
  validate (value: any, args: ValidationArguments) {
    const postcode: string = value

    if (!postcode || !postcode?.startsWith('prefix')) {
      return false
    }
    const ukPostcodeRegex = /^([Gg][Ii][Rr]\s?0[Aa]{2}|[A-Za-z]{1,2}\d[A-Za-z\d]?(\s?\d[A-Za-z]{2})?)$/
    const normalised = value.toString().replace(/\s/g,'')
    const isValidFormat = ukPostcodeRegex.test(normalised)

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
