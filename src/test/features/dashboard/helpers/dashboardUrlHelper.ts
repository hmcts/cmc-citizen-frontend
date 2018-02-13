import { expect } from 'chai'
import { sampleClaimObj, sampleDefendantResponseObj } from '../../../http-mocks/claim-store'
import { DashboardUrlHelper } from 'dashboard/helpers/dashboardUrlHelper'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'

describe('DashboardUrlHelper', () => {
  describe('getStatusUrl', () => {
    it('should return settlement pdf when there is a settlement', () => {
      const claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          ...{ settlementReachedAt: '2017-07-26T22:45:51.785' }
        })

      expect(DashboardUrlHelper.getStatusUrl(claim))
        .to.equal(Paths.agreementReceiver.evaluateUri({ externalId: claim.externalId }))

    })
    it('should return response task-list page when there is no response', () => {
      const claim = new Claim().deserialize(sampleClaimObj)

      expect(DashboardUrlHelper.getStatusUrl(claim))
        .to.equal(Paths.responseTaskListPage.evaluateUri({ externalId: claim.externalId }))
    })
    it('should return offer response page when there is a response and no settlement', () => {
      const claim = new Claim().deserialize({ ...sampleClaimObj, ...sampleDefendantResponseObj })

      expect(DashboardUrlHelper.getStatusUrl(claim))
        .to.equal(Paths.offerResponsePage.evaluateUri({ externalId: claim.externalId }))
    })
  })
  describe('getNextResponseUrl', () => {

    it('should return defendant page when there is a response', () => {
      const claim = new Claim().deserialize({ ...sampleClaimObj, ...sampleDefendantResponseObj })

      expect(DashboardUrlHelper.getNextResponseUrl(claim))
        .to.equal(Paths.defendantPage.evaluateUri({ externalId: claim.externalId }))
    })

    it('should return task-list page when there is no response or ccj', () => {
      const claim = new Claim().deserialize(sampleClaimObj)

      expect(DashboardUrlHelper.getNextResponseUrl(claim))
        .to.equal(Paths.responseTaskListPage.evaluateUri({ externalId: claim.externalId }))

    })

    it('should return defendant page when there is a ccj', () => {
      const claim = new Claim().deserialize(
        {
          ...sampleClaimObj,
          ...{ countyCourtJudgmentRequestedAt: '2017-07-26T22:45:51.785' }
        })

      expect(DashboardUrlHelper.getNextResponseUrl(claim))
        .to.equal(Paths.defendantPage.evaluateUri({ externalId: claim.externalId }))
    })
  })
})
