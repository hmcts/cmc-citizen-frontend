import { expect } from 'chai'
import { checkDefined, checkNotEmpty } from 'shared/preconditions'

describe('Preconditions', () => {
  describe('checkDefined', () => {
    it('should throw an error when value is undefined', () => {
      expect(() => {
        checkDefined(undefined, 'Value is required')
      }).to.throw(Error, 'Value is required')
    })

    it('should throw an error when value is null', () => {
      expect(() => {
        checkDefined(null, 'Value is required')
      }).to.throw(Error, 'Value is required')
    })

    it('should not throw an error when value is defined', () => {
      expect(() => {
        checkDefined({}, 'Value is required')
      }).to.not.throw(Error)
    })
  })

  describe('checkNotEmpty', () => {
    it('should throw an error when value is undefined', () => {
      expect(() => {
        checkNotEmpty(undefined, 'Value cannot be empty')
      }).to.throw(Error, 'Value cannot be empty')
    })

    it('should throw an error when value is null', () => {
      expect(() => {
        checkNotEmpty(null, 'Value cannot be empty')
      }).to.throw(Error, 'Value cannot be empty')
    })

    describe('array argument', () => {
      it('should throw an error when value is empty', () => {
        expect(() => {
          checkNotEmpty([], 'Value cannot be empty')
        }).to.throw(Error, 'Value cannot be empty')
      })

      it('should not throw an error when value is not empty', () => {
        expect(() => {
          checkNotEmpty(['test'], 'Value cannot be empty')
        }).to.not.throw(Error)
      })
    })

    describe('string argument', () => {
      it('should throw an error when value is empty', () => {
        expect(() => {
          checkNotEmpty('', 'Value cannot be empty')
        }).to.throw(Error, 'Value cannot be empty')
      })

      it('should not throw an error when value is not empty', () => {
        expect(() => {
          checkNotEmpty('test', 'Value cannot be empty')
        }).to.not.throw(Error)
      })
    })
  })
})
