import { expect } from 'chai'

import { yesNoFilter } from 'modules/nunjucks/filters/yesNoFilter'
import { YesNoOption } from 'models/yesNoOption'

describe('Yes no filter', () => {
  describe('formats YesNoOption correctly', () => {
    it('When given YesNoOption.YES', () => {
      expect(yesNoFilter(YesNoOption.YES)).is.equal('Yes')
    })

    it('When given YesNoOption.NO', () => {
      expect(yesNoFilter(YesNoOption.NO)).is.equal('No')
    })

    it('When given YesNoObject created from invalid object', () => {
      expect(() => {
        yesNoFilter(YesNoOption.fromObject('invalid'))
      }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty')
    })
  })

  describe('formats strings correctly', () => {
    it('When given yes', () => {
      expect(yesNoFilter(YesNoOption.YES.option)).is.equal('Yes')
    })

    it('When given no', () => {
      expect(yesNoFilter(YesNoOption.NO.option)).is.equal('No')
    })

    it('When given any other string, returns No', () => {
      expect(yesNoFilter('invalid')).is.equal('No')
    })

    it('When given an empty string', () => {
      expect(() => {
        yesNoFilter('')
      }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty')
    })
  })

  describe('throws an exception when', () => {
    it('given an undefined object', () => {
      expect(() => {
        yesNoFilter(undefined)
      }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty')
    })

    it('given null', () => {
      expect(() => {
        yesNoFilter(null)
      }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty')
    })
  })
})
