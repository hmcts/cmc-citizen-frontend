import { join } from 'path'

const ccbcCaseIdentifiers: string[] = require(join(__dirname, '..', '..', 'resources', 'ccbc_case_identifiers.json'))

/**
 * Checks against a list of CCBC case IDs and if they contained in the string provided
 * returns true
 * @param {string} referenceNumber the reference number, returns false if not provided
 * @returns {boolean} if the reference is likely a CCBC reference
 */
export function isCCBCCaseReference (referenceNumber?: string): boolean {
  if (!referenceNumber) {
    return false
  }

  return /[A-Z][\d][A-Z0-9]{2}[\d][A-Z0-9]{3}/i.test(referenceNumber)
    || (/^\d\d\d\D\D\d\d\d$/i.test(referenceNumber)
      && ccbcCaseIdentifiers.filter((id) => referenceNumber.toUpperCase().includes(id)).length > 0)
}
