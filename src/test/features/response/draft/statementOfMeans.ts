/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

describe('StatementOfMeans', () => {
  context('when creating a new instance', () => {
    it('should set fields to blanks', () => {
      const statementOfMeans: StatementOfMeans = new StatementOfMeans()
      expect(statementOfMeans.residence).to.be.undefined
    })
  })

  context('when deserializing', () => {
    it('should use values from given input', () => {
      const statementOfMeans: StatementOfMeans = new StatementOfMeans().deserialize({
        residence: {
          type: {
            value: ResidenceType.OTHER.value,
            displayValue: ResidenceType.OTHER.displayValue
          },
          housingDetails: 'Squat'
        }
      })
      expect(statementOfMeans.residence).to.be.instanceOf(Residence)
      expect(statementOfMeans.residence.type.value).to.equal(ResidenceType.OTHER.value)
    })

    it('should set a blank instance if input does not have related property', () => {
      const statementOfMeans: StatementOfMeans = new StatementOfMeans().deserialize({ })
      expect(statementOfMeans.residence).to.be.instanceOf(Residence)
      expect(statementOfMeans.residence.type).to.be.undefined
    })
  })
})
