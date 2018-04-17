/**
 * Checks if given reference number is a CMC reference number.
 *
 * @param {string} referenceNumber the reference number
 * @returns {boolean} true if the number if a CMC reference number, false otherwise
 */
export function isCMCReference (referenceNumber?: string): boolean {
  if (!referenceNumber) {
    return false
  }

  return /^\d\d\dMC\d\d\d$/i.test(referenceNumber)
}
