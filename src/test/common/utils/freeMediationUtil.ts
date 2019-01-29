import { expect } from 'chai'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { FreeMediation } from 'forms/models/freeMediation'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

describe('FreeMediationUtil', () => {

  context('Should return expected Free Mediation when', () => {

    it('yes value is provided', () => {
      const freeMediation: FreeMediation = new FreeMediation('yes')
      const expectedValue: YesNoOption = YesNoOption.YES
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'Yes is expected')
    })

    it('no value is provided', () => {
      const freeMediation: FreeMediation = new FreeMediation('no')
      const expectedValue: YesNoOption = YesNoOption.NO
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'No is expected')
    })

    it('undefined value is provided', () => {
      const freeMediation = undefined
      const expectedValue: YesNoOption = YesNoOption.NO
      expect(FreeMediationUtil.convertFreeMediation(freeMediation)).to.be.deep.eq(expectedValue, 'No is expected')
    })

  })
})
