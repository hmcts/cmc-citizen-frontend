import { expect } from 'chai'

import { BaseParameters } from '../../../main/app/utils/models/pcqParameters'
import { TokenGenerator } from '../../../main/app/utils/tokenGenerator'

describe('TokenGenerator', () => {
  describe('should generate the encrypted query string', () => {
    it('generate a token from PCQ base parameters', () => {

      const params: BaseParameters = {
        serviceId: 'CMC',
        actor: 'CLAIMANT',
        pcqId: 'abc123',
        partyId: 'test@test.com',
        returnUrl: 'test.com',
        language: 'en'
      }

      expect(TokenGenerator.gen(params)).to.not.equal(null)
    })
  })
})
