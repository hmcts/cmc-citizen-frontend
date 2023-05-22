import { expect } from 'chai'
import { mockReq as req } from 'sinon-express-mock'
import { RoutablePath } from 'shared/router/routablePath'
import { PcqClient } from 'utils/pcqClient'
import * as config from 'config'

describe('PCQ Client', () => {

  describe('is Eligible to for PCQ questionnaire', () => {
    it('Should pass eligible (Returns true) ', () => {
      const pcqID = undefined
      const partyType = 'individual'
      let eligible = PcqClient.isEligibleRedirect(pcqID, partyType)
      eligible.then(function (data) {
        expect(data).to.equal(true)
      })
    })

    it('Should not eligible (Returns false) ', () => {
      const pcqID = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const partyType = 'individual'
      let eligible = PcqClient.isEligibleRedirect(pcqID, partyType)
      eligible.then(function (data) {
        expect(data).to.equal(false)
      })
    })
    it('Should not eligible (if party is not individual) ', () => {
      const pcqID = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const partyType = 'Organisation'
      let eligible = PcqClient.isEligibleRedirect(pcqID, partyType)
      eligible.then(function (data) {
        expect(data).to.equal(false)
      })
    })
  })

  describe(`generator should create URL `, () => {
    it('for generate redirect URL request ', () => {
      const pcqBaseUrl: string = `${config.get<string>('pcq.url')}`
      const path = new RoutablePath('my/service/path')
      const externalId = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const pcqID = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const expected = 'pcqId=72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const expectedUrl = pcqBaseUrl + '/service-endpoint?pcqId=72927c05-7d52-4dcf-9759-7ff6236fbea4&serviceId=CMC&actor=CLAIMANT&ccdCaseId=123' +
        '&partyId=test@test.com&returnUrl='
      req.secure = true
      req.headers = { host: 'localhost' }
      let returnUrl = PcqClient.generateRedirectUrl(req, 'CLAIMANT', pcqID, 'test@test.com', 123, path, externalId)
      expect(returnUrl.length).gt(0)
      expect(returnUrl).to.contain(expected)
      expect(returnUrl).to.contain(expectedUrl)
      expect(returnUrl).not.contain(':externalId')
    })

    it('for undefined return path ', () => {
      req.secure = false
      const externalId = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      const pcqID = '72927c05-7d52-4dcf-9759-7ff6236fbea4'
      req.headers = { host: 'localhost' }
      expect(() => PcqClient.generateRedirectUrl(req, 'DEFENDANT', pcqID, 'test@test.com', null, undefined, externalId)).to.throw(Error, 'Request is undefined')
    })
  })
})
