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

      const expectedCiphertext = '9036d7faecda1698f1ce8dffa80ed9be08366e14268dc7a1cec2694f1b5597d51801ea0ea7100dc8f2d86be9c488a31ad02fe' +
        '3a6537831b4c34181945d22ba9c0995ffd64007cd7a9fa9316648f119372f1d111071687b553090c4df36e658e808dc6e0c8ac8e984203e6f404e1955dd0cb3c' +
        'eedaf7db450ae50a87a0b677a79'

      expect(TokenGenerator.gen(params)).to.eq(expectedCiphertext)
    })
  })
})
