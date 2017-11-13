/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

describe('ResidenceType', () => {
  describe('all', () => {
    it('should contain expected items only', () => {
      expect(ResidenceType.all()).to.have.members([
        ResidenceType.OWN_HOME,
        ResidenceType.JOINT_OWN_HOME,
        ResidenceType.PRIVATE_RENTAL,
        ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME,
        ResidenceType.OTHER
      ])
    })
  })

  describe('valueOf', () => {
    it('should return correct values', () => {
      ResidenceType.all().forEach((element) => {
        expect(ResidenceType.valueOf(element.value).value).to.equal(element.value)
      })
    })

    it('should return undefined when given undefined as input', () => {
      expect(ResidenceType.valueOf(undefined)).to.be.undefined
    })
  })
})
