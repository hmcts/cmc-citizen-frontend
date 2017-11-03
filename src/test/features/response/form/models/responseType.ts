import { expect } from 'chai'
import { ResponseType } from 'response/form/models/responseType'

describe('ResponseType', () => {

  describe('valueOf', () => {

    it('should return ResponseType for corresponding value', () => {
      expect(ResponseType.valueOf(ResponseType.OWE_ALL_PAID_NONE.value)).to.be.eq(ResponseType.OWE_ALL_PAID_NONE)
      expect(ResponseType.valueOf(ResponseType.OWE_NONE.value)).to.be.eq(ResponseType.OWE_NONE)
      expect(ResponseType.valueOf(ResponseType.OWE_SOME_PAID_NONE.value)).to.be.eq(ResponseType.OWE_SOME_PAID_NONE)
    })

    it('should return undefined for incorrect value', () => {
      expect(ResponseType.valueOf('I do not exist')).to.be.eq(undefined)
    })

  })
})
