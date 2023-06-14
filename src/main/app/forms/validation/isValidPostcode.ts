export class IsValidPostcodeConstraint {

  validate (value: any): boolean {
    if (value === undefined || value === null) {
      return true
    }
    const UK_POSTCODE_REGEX = /^(?!.*[GIJKLMNOQVWXZ])([A-PR-UWYZ][0-9][A-HJKPSTUW])\s*([0-9][ABD-HJLNP-UW-Z]{2})$/i
    const normalised = value.toString().replace(/\s/g, '')
    return UK_POSTCODE_REGEX.test(normalised)
  }

  defaultMessage (): string {
    return 'Enter a valid postcode'
  }
}
