/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { AgeGroupTypeViewFilter } from 'claimant-response/filters/age-group-type-view-filter'
import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'

describe('Age group type view filter', () => {
  it("should map 'UNDER_11' to 'under 11'", () => {
    expect(AgeGroupTypeViewFilter.render(AgeGroupType.UNDER_11)).to.equal('under 11')
  })

  it("should map 'BETWEEN_11_AND_15' to '11 to 15'", () => {
    expect(AgeGroupTypeViewFilter.render(AgeGroupType.BETWEEN_11_AND_15)).to.equal('11 to 15')
  })

  it("should map 'BETWEEN_16_AND_19' to '16 to 19'", () => {
    expect(AgeGroupTypeViewFilter.render(AgeGroupType.BETWEEN_16_AND_19)).to.equal('16 to 19')
  })

  it('should map any other value to undefined', () => {
    expect(AgeGroupTypeViewFilter.render('OVER_19')).to.be.undefined
  })

  it('should map null to undefined', () => {
    expect(AgeGroupTypeViewFilter.render(null)).to.be.undefined
  })
})
