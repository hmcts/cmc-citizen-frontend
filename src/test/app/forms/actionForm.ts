import { expect } from 'chai'

import { ActionForm } from 'forms/actionForm'

describe('ActionForm', () => {
  describe('buildPostbackFocusTarget', () => {
    it('should throw an error when action is not set', () => {
      expect(() => ActionForm.buildPostbackFocusTarget(undefined)).to.throw(Error)
    })

    it('should throw an error if action is not an object', () => {
      expect(() => ActionForm.buildPostbackFocusTarget('I am a string')).to.throw(Error)
    })

    it('should throw an error if action object has multiple keys', () => {
      const action = {
        firstKey: 'value 1',
        secondKey: 'value 2'
      }
      expect(() => ActionForm.buildPostbackFocusTarget(action)).to.throw(Error)
    })

    it('should throw an error if action object has no keys', () => {
      expect(() => ActionForm.buildPostbackFocusTarget({ })).to.throw(Error)
    })

    it('should set postbackFocusTarget to expected string value if correct action object is available', () => {
      const action = {
        addRow: 'Add new row'
      }
      expect(ActionForm.buildPostbackFocusTarget(action)).to.equal('action[addRow]')
    })
  })
})
