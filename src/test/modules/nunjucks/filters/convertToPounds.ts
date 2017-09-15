import { expect } from 'chai'

import { convertToPoundsFilter } from 'modules/nunjucks/filters/convertToPounds'

describe('convertToPoundsFilter', () => {
  it('converts pennies to pounds', () => {
    expect(convertToPoundsFilter(151)).to.eq(1.51)
    expect(convertToPoundsFilter(150)).to.eq(1.5)
    expect(convertToPoundsFilter(100)).to.eq(1)
  })

  describe('throws exception when', () => {
    it('undefined given', () => {
      expectToThrowError(undefined)
    })

    it('non number given', () => {
      expectToThrowError('Hi')
    })
  })
})

function expectToThrowError (input: any): void {
  expect(() => {
    convertToPoundsFilter(input)
  }).to.throw(Error, 'Value should be a number')
}
