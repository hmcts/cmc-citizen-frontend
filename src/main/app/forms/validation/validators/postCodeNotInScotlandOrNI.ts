import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'

@ValidatorConstraint({ name: 'postcodeNotInScotlandOrNI', async: false })
export class PostcodeNotInScotlandOrNIValidator implements ValidatorConstraintInterface {
  validate (value: any, args: ValidationArguments) {
    const postcode: string = value

    if (!postcode) {
      return false
    }

    const ukPostcodeRegex = /^([Gg][Ii][Rr]\s?0[Aa]{2}|[A-Za-z]{1,2}\d[A-Za-z\d]?(\s?\d[A-Za-z]{2})?)$/
    const normalised = value.toString().replace(/\s/g, '').toUpperCase()
    const isValidFormat = ukPostcodeRegex.test(normalised)

    if (!isValidFormat) {
      return false
    }

    const isScotlandPostcode: boolean =
      normalised.startsWith('KW') ||
      normalised.startsWith('IV') ||
      normalised.startsWith('HS') ||
      normalised.startsWith('PH') ||
      normalised.startsWith('AB') ||
      normalised.startsWith('DD') ||
      normalised.startsWith('KY') ||
      normalised.startsWith('FK') ||
      normalised.startsWith('EH') ||
      normalised.startsWith('KA') ||
      normalised.startsWith('ML') ||
      normalised.startsWith('PA') ||
      (normalised.startsWith('TD') && !normalised.startsWith('TD9') && !normalised.startsWith('TD12') && !normalised.startsWith('TD15')) ||
      (normalised.startsWith('DG') && !normalised.startsWith('DG16')) ||
      (normalised.startsWith('G') && !normalised.startsWith('GU') && !normalised.startsWith('GL'))

    const isNIPostcode: boolean = normalised.startsWith('BT')

    if (isScotlandPostcode || isNIPostcode) {
      return false
    }
    if (normalised.startsWith('DG16')) {
      if (
        normalised.match(/^DG16 5H[TUZ]/) ||
        normalised.match(/^DG16 5J[AB]/)
      ) {
        return false
      } else if (normalised.startsWith('DG')) {
        return true
      }
    } else if (normalised.startsWith('TD9')) {
      if (normalised.match(/^TD9 0T[JPRSTUW]/)) {
        return false
      }
    } else if (normalised.startsWith('TD12')) {
      if (normalised.match(/^TD12 4[ABDEHJLN]/)) {
        return false
      }
    } else if (normalised.startsWith('TD15')) {
      if (normalised.match(/^TD15 2/) || normalised.match(/^TD15 9/)) {
        return false
      } else if (normalised.match(/^TD15 1T[ABQUX]/) || normalised.match(/^TD15 1XX/)) {
        return false
      } else if (
        normalised.match(/^TD15 1B/) ||
        normalised.match(/^TD15 1S[ABEJLNPWXY]/) ||
        normalised.match(/^TD15 1U[BDENPQRTUXY]/)
      ) {
        return false
      } else if (normalised.startsWith('TD')) {
        return true
      }
    }

    return true
  }

  defaultMessage (args: ValidationArguments) {
    return ValidationErrors.DEFENDANT_POSTCODE_NOT_VALID
  }
}
