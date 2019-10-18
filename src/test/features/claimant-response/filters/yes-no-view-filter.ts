/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { YesNoViewFilter } from 'claimant-response/filters/yes-no-view-filter'

describe('Yes/No view filter', () => {
  it(`should map true to 'yes'`, () => {
    expect(YesNoViewFilter.render(true)).to.equal('Yes')
  })

  it(`should map false to 'no'`, () => {
    expect(YesNoViewFilter.render(false)).to.equal('No')
  })
})
