import { expect } from 'chai'
import { ResponseType } from 'response/form/models/responseType'

describe('ResponseType', () => {

  describe('all', () => {

    it('should return array of 3', () => {
      const actual: ResponseType[] = ResponseType.all()
      expect(actual.length).to.be.eq(3)
    })

  })

  describe('valueOf', () => {

    it('should return ResponseType', () => {
      expect(ResponseType.valueOf(ResponseType.OWE_ALL_PAID_NONE.value)).to.be.eq(ResponseType.OWE_ALL_PAID_NONE)
      expect(ResponseType.valueOf(ResponseType.OWE_NONE.value)).to.be.eq(ResponseType.OWE_NONE)
      expect(ResponseType.valueOf(ResponseType.OWE_SOME_PAID_NONE.value)).to.be.eq(ResponseType.OWE_SOME_PAID_NONE)
    })

    it('should return undefined', () => {
      expect(ResponseType.valueOf('I do not exist')).to.be.eq(undefined)
    })

  })
})
