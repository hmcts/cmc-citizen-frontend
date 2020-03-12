import { WebChat } from 'routes/webchat'
import { expect } from 'chai'

const secrets = {
  'cmc-webchat-id': 1212121.234324,
  'cmc-webchat-tenant': 1212121.23214,
  'cmc-webchat-no-client': 1212121.324324,
  'different-secret': 1212121
}

const expectedSecrets = {
  'cmc-webchat-id': 1212121.234324,
  'cmc-webchat-tenant': 1212121.23214,
  'cmc-webchat-no-client': 1212121.324324
}

describe('webchat', async () => {
  describe('on filterSecrets', () => {
    it('should return only filtered secrets', async () => {
      const filterSecrets = WebChat.filterSecrets('cmc-webchat', secrets)
      expect(filterSecrets).to.deep.eq(expectedSecrets)
    })
  })
})
