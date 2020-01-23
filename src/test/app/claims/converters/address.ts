import { expect } from 'chai'
import { Address as FormAddress } from 'forms/models/address'
import { Address } from 'claims/models/address'
import { convertAddress } from 'claims/converters/address'
import { generateString } from 'test/app/forms/models/validationUtils'

describe('Address converter', () => {

  context('should convert form address model to address model', () => {

    it('when all fields populated', () => {
      const formAddress = new FormAddress(
        generateString(10), generateString(10), generateString(10), generateString(6)
      )
      const actual: Address = convertAddress(formAddress)

      expectAllFieldsMappedCorrectly(formAddress, actual)
    })

    it('when all fields empty', () => {
      const formAddress = new FormAddress()
      const actual: Address = convertAddress(formAddress)

      expectAllFieldsMappedCorrectly(formAddress, actual)
    })

    it('when instance of Object given', () => {
      const formAddress = {}
      const actual: Address = convertAddress(formAddress as any)

      expectAllFieldsMappedCorrectly(formAddress as any, actual)
    })
  })

})

function expectAllFieldsMappedCorrectly (expected: FormAddress, actual: Address): void {
  expect(actual).to.be.instanceof(Address)
  expect(actual.line1).to.be.equal(expected.line1)
  expect(actual.line2).to.be.equal(expected.line2)
  expect(actual.line3).to.be.equal(expected.line3)
  expect(actual.postcode).to.be.equal(expected.postcode)
  expect(actual.city).to.be.equal(expected.city)
}
