import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import { FrequencyViewFilter } from 'claimant-response/filters/frequency-view-filter'

describe('Frequency view filter', () => {
  context('render frequency', () => {
    Frequency.all()
      .forEach(frequency => {
        it(`should render ${frequency} as ${frequency.displayValue}`, () => {
          expect(FrequencyViewFilter.render(frequency)).to.equal(frequency.displayValue)
        })
      })

    it('should throw an error for null', () => {
      expect(() => FrequencyViewFilter.render(null)).to.throw(TypeError)
    })
  })

  context('render payment frequency', () => {
    // TODO: https://tools.hmcts.net/jira/browse/ROC-5325
  })
})
