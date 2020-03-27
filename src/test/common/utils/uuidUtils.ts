/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { UUIDUtils } from 'shared/utils/uuidUtils'

describe('UUIDUtils', () => {
  const uuid = 'cde28f9f-3574-423b-8026-2092cad1f3cd'

  describe('extractFrom', () => {
    it('should throw an error when string argument is not provided', () => {
      expect(() => UUIDUtils.extractFrom(undefined)).to.throw(Error, 'String to extract UUID from is required')
    })

    it('should return undefined when UUID is not in place', () => {
      expect(UUIDUtils.extractFrom('/case/start')).to.be.undefined
    })

    it('should return UUID when UUID is in place', () => {
      expect(UUIDUtils.extractFrom(uuid)).to.be.equal(uuid)
      expect(UUIDUtils.extractFrom(`/${uuid}`)).to.be.equal(uuid)
      expect(UUIDUtils.extractFrom(`/case/${uuid}`)).to.be.equal(uuid)
      expect(UUIDUtils.extractFrom(`/case/${uuid}/response`)).to.be.equal(uuid)
    })

    it('should return first UUID when many UUIDs are in place', () => {
      expect(UUIDUtils.extractFrom(`/case/${uuid}/claimant/28abbcc8-bd40-49d8-926a-e59fa62c5a2f`)).to.be.equal(uuid)
    })

    it('should return last UUID when many UUIDs are in place', () => {
      expect(UUIDUtils.extractDocumentId(`/case/28abbcc8-bd40-49d8-926a-e59fa62c5a2f/claimant/${uuid}`)).to.be.equal(uuid)
    })
  })
})
