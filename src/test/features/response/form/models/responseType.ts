import { expect } from 'chai'
import { ResponseType } from 'response/form/models/responseType'

describe('ResponseType', () => {

  describe('valueOf', () => {

    it('should return ResponseType for corresponding value', () => {
      expect(ResponseType.valueOf(ResponseType.FULL_ADMISSION.value)).to.be.eq(ResponseType.FULL_ADMISSION)
      expect(ResponseType.valueOf(ResponseType.DEFENCE.value)).to.be.eq(ResponseType.DEFENCE)
      expect(ResponseType.valueOf(ResponseType.PART_ADMISSION.value)).to.be.eq(ResponseType.PART_ADMISSION)
    })

    it('should return undefined for incorrect value', () => {
      expect(ResponseType.valueOf('I do not exist')).to.be.eq(undefined)
    })

  })
})
