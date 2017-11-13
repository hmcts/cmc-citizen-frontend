/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { Residence } from 'response/form/models/statement-of-means/residence'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

describe('Residence', () => {
  context('draft object deserialisation', () => {
    it('should return an instance with blank fields when given undefined', () => {
      const residence: Residence = new Residence().deserialize(undefined)
      expect(residence.type).to.be.undefined
      expect(residence.otherTypeDetails).to.be.undefined
    })

    it('should return with given values when given an object', () => {
      const residence: Residence = new Residence().deserialize({
        type: ResidenceType.OTHER,
        otherTypeDetails: 'Squat'
      })
      expect(residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(residence.otherTypeDetails).to.equal('Squat')
    })
  })

  context('form object deserialisation', () => {
    it('should return undefined if given undefined', () => {
      expect(Residence.fromObject(undefined)).to.be.undefined
    })

    it('should return Residence instance build based on given form input', () => {
      const residence: Residence = Residence.fromObject({
        type: 'OTHER',
        otherTypeDetails: 'Squat'
      })
      expect(residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(residence.otherTypeDetails).to.equal('Squat')
    })

    it('should set otherTypeDetails to undefined if type different to OTHER is provided', () => {
      const residence: Residence = Residence.fromObject({
        type: 'OWN_HOME',
        otherTypeDetails: 'Some details'
      })
      expect(residence.otherTypeDetails).to.be.undefined
    })
  })
})
