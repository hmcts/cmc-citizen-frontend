import { expect } from 'chai'
import { ResidenceTypeViewFilter } from 'claimant-response/filters/residence-type-view-filter'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

describe('Residence type view filter', () => {
  ResidenceType.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(ResidenceTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should throw an error for anything else', () => {
    expect(() => ResidenceTypeViewFilter.render('IGLOO')).to.throw(TypeError)
  })

  it('should throw an error for null', () => {
    expect(() => ResidenceTypeViewFilter.render(null)).to.throw(TypeError)
  })
})
