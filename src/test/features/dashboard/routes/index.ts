import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'
import { MomentFactory } from 'shared/momentFactory'
import {
  baseFullAdmissionData,
  basePartialAdmissionData,
  basePayByInstalmentsData,
  basePayBySetDateData,
  basePayImmediatelyData,
  baseResponseData
} from 'test/data/entity/responseData'
import { baseAcceptationClaimantResponseData } from 'test/data/entity/claimantResponseData'
import { sampleClaimIndividualVsIndividualIssueObj } from '../../../data/entity/claimIssueData'

const cookieName: string = config.get<string>('session.cookieName')

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        draftStoreServiceMock.resolveFind('claim')
        claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error')

        await request(app)
          .get(Paths.dashboardPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when no claims issued', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
        })

        it('should render page with continue claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Continue with claim'))
        })
      })

      context('Claimant status', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
        })

        it('should render page with start claim button when everything is fine', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your money claims account', 'Make a new money claim'))
        })

        it('should render page with claim number and status', async () => {
          draftStoreServiceMock.resolveFindNoDraftFound()
          claimStoreServiceMock.resolveRetrieveBySampleData(sampleClaimIndividualVsIndividualIssueObj)

          await request(app)
            .get(Paths.dashboardPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('000MC050', 'Your claim has been sent'))
        })
      })

      context('when checking the status of a claim', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFindNoDraftFound()
        })

        context('as a claimant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          it('should show the correct status when the claim is issued', async () => {
            claimStoreServiceMock.resolveRetrieveByClaimantId(claimStoreServiceMock.sampleClaimIssueObj, {
              responseDeadline: MomentFactory.currentDate().add(1, 'days')
            })
            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your claim has been sent.'))
          })

          context('when the claim is in full admission', () => {
            const fullAdmissionClaim = {
              ...claimStoreServiceMock.sampleClaimObj,
              responseDeadline: MomentFactory.currentDate().add(1, 'days'),
              response: {
                ...baseResponseData,
                ...baseFullAdmissionData
              }
            }
            it('should show the correct status when the claim is marked as pay immediately', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant admits they owe all the money. They’ve said that they will pay immediately.'))
            })

            it('should show the correct status when the claim is marked as pay immediately and payment is past the deadline', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(fullAdmissionClaim, {
                responseDeadline: MomentFactory.currentDate().subtract(1, 'days'),
                response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant has not responded to your claim. You can request a County Court Judgment against them.'))
            })

            it('should show the correct status when the claim is marked as pay by set date', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant has offered to pay by a set date. You can accept or reject their offer.'))
            })

            it('should show the correct status when the claim is marked as pay by instalments', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant has offered to pay in instalments. You can accept or reject their offer.'))
            })
          })
          context('when the claim is in partial admission', () => {
            const partAdmissionClaim = {
              ...claimStoreServiceMock.sampleClaimObj,
              responseDeadline: MomentFactory.currentDate().add(1, 'days'),
              response: {
                ...baseResponseData,
                ...basePartialAdmissionData,
                amount: 30
              }
            }
            it('should show the correct status when the claim is marked as pay immediately', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'))
            })

            it('should show the correct status when the claim is marked as pay immediately and the offer is accepted', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
                claimantResponse: baseAcceptationClaimantResponseData
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve accepted the defendant’s part admission. They said they’d pay immediately.'))
            })

            it('should show the correct status when the claim is marked as pay immediately and the offer is accepted and response is after the deadline', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
                claimantResponse: baseAcceptationClaimantResponseData,
                responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant has not responded to your claim. You can request a County Court Judgment against them.'))
            })

            it('should show the correct status when the claim is marked as pay by set date', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayBySetDateData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'))
            })

            it('should show the correct status when the claim is marked as pay by instalments', async () => {
              claimStoreServiceMock.resolveRetrieveByClaimantId(partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('The defendant believes they owe you £30. You can accept or reject that this is the amount owed.'))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          })

          it('should show the correct status when the claim is issued', async () => {
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', claimStoreServiceMock.sampleClaimIssueObj, {
              responseDeadline: MomentFactory.currentDate().add(1, 'days')
            })

            await request(app)
              .get(Paths.dashboardPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Respond to claim.', '(1 day remaining)'))
          })

          context('when the claim is in full admission', () => {
            const fullAdmissionClaim = {
              ...claimStoreServiceMock.sampleClaimObj,
              responseDeadline: MomentFactory.currentDate().add(1, 'days'),
              response: {
                ...baseResponseData,
                ...baseFullAdmissionData
              }
            }
            it('should show the correct status when the claim is marked as pay immediately', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted all of the claim and said you’ll pay the full amount immediately.'))
            })

            it('should show the correct status when the claim is marked as pay immediately and payment is past the deadline', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData },
                responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You haven’t responded to the claim.', 'John Smith can now ask for a County Court Judgment (CCJ) against you.', 'You can still respond to this claim before they ask for a CCJ.'))
            })

            it('should show the correct status when the claim is marked as pay by set date', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted all of the claim and offered to pay the full amount by 31 December 2050.'))
            })

            it('should show the correct status when the claim is marked as pay by instalments', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', fullAdmissionClaim, {
                response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted all of the claim and offered to pay the full amount in instalments.'))
            })
          })
          context('when the claim is in partial admission', () => {
            const partAdmissionClaim = {
              ...claimStoreServiceMock.sampleClaimObj,
              responseDeadline: MomentFactory.currentDate().add(1, 'days'),
              response: {
                ...baseResponseData,
                ...basePartialAdmissionData,
                amount: 30
              }
            }
            it('should show the correct status when the claim is marked as pay immediately', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted part of the claim.'))
            })

            it('should show the correct status when the claim is marked as pay immediately and the offer is accepted', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
                claimantResponse: baseAcceptationClaimantResponseData
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('John Smith accepted your admission of £30'))
            })

            it('should show show the correct status when the claim is marked as pay immediately and the offer is accepted and response is after the deadline', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
                claimantResponse: baseAcceptationClaimantResponseData,
                responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You haven’t responded to the claim.', 'John Smith can now ask for a County Court Judgment (CCJ) against you.', 'You can still respond to this claim before they ask for a CCJ.'))
            })

            it('should show the correct status when the claim is marked as pay by set date', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayBySetDateData }
              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted part of the claim.'))
            })

            it('should show the correct status when the claim is marked as pay by instalments', async () => {
              claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001', '1', partAdmissionClaim, {
                response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData }

              })

              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('You’ve admitted part of the claim.'))
            })
          })
        })
      })
    })
  })
})
