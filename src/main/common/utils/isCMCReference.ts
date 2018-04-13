/**
 * Checks if given reference number is not a CMC reference number.
 *
 * @param {string} referenceNumber the reference number
 * @returns {boolean} true if the number if not a CMC reference number, false otherwise
 */
export function isCMCReference (referenceNumber?: string): boolean {
  if (!referenceNumber) {
    return false
  }

  return referenceNumber.match(/^\d\d\dMC\d\d\d$/i) !== null
}
