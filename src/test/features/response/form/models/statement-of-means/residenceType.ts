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

    it('should throw an error when given an unknown value', () => {
      expect(() => ResidenceType.valueOf('I am not a valid type')).to.throw(Error)
    })
  })
})
