import { expect } from 'chai'

import { EvidenceType } from 'forms/models/evidenceType'

describe('EvidenceType', () => {

  describe('valueOf', () => {

    it('should return EvidenceType object when valid input given', () => {
      const actual: EvidenceType = EvidenceType.valueOf(EvidenceType.OTHER.value)

      expect(actual).to.equal(EvidenceType.OTHER)
    })

    it('should return unknown when invalid input given', () => {
      const actual: EvidenceType = EvidenceType.valueOf('unknown type')

      expect(actual).to.equal(undefined)
    })
  })

  describe('all', () => {
    it('should return array of EvidenceType', () => {
      expect(EvidenceType.all().length).to.equal(7)
    })
  })
})
