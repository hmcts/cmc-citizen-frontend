import { join } from 'path'

const ccbcCaseIdentifier: string[] = require(join(__dirname, '..', '..', 'resources', 'ccbc_case_identifiers.json'))

export function isCCBCCaseReference (referenceNumber: string): boolean {
  if (!referenceNumber || referenceNumber.length < 2) {
    return false
  }

  return ccbcCaseIdentifier.filter((id) => referenceNumber.includes(id)).length > 0
}
