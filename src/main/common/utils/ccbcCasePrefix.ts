import { join } from 'path'

const ccbcPrefixes: string[] = require(join(__dirname, '..', '..', 'resources', 'ccbc_case_prefixes.json'))

export function isCCBCCasePrefix (referenceNumber: string): boolean {
  if (!referenceNumber || referenceNumber.length < 2) {
    return false
  }

  return ccbcPrefixes.includes(referenceNumber.substring(0, 2))
}
