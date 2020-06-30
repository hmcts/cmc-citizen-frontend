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

      const expectedCiphertext = '3b74573af3cf7403d07f8f9b58e8fbfae5b41a389469858da85f94caf089a4ddd5c3492a274ac2fc2a1f794194d1af7c7773384262' +
        '487557d4f6a2b4fd6f1298b4f567afd63126d4d27e235cba3b9873d68a9b366b3b6e2a2c48dcef585ab233df00973aca82a3338bb0e6c0df128afa7146869861b60' +
        'bb6fe0ea361c9989258'
      expect(TokenGenerator.gen(params)).to.eq(expectedCiphertext)
    })
  })
})
