import { offer } from 'integration-test/data/test-data'
import { DefendantOfferPage } from 'integration-test/tests/citizen/offers/pages/defendant-offer'
import I = CodeceptJS.I

const I: I = actor()
const defendantOfferPage: DefendantOfferPage = new DefendantOfferPage()

export class OfferSteps {

  makeOffer (): void {
    I.see('Make an offer to settle out of court')
    I.click('Continue')
    defendantOfferPage.enterOffer(offer.offerText, offer.completionDate)
  }

  makeOfferFromDashboard (claimRef: string): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
    I.click('settle the claim out of court')
    this.makeOffer()
  }

  acceptOffer (): void {
    I.checkOption('Yes')
    I.click('Continue')
    I.click('Make an agreement')
    this.signAgreement()
    I.see('You’ve signed the agreement')
  }

  rejectOffer (): void {
    I.checkOption('No')
    I.click('Continue')
    I.see('You’ve rejected an offer to settle out of court')
  }

  acceptOfferFromDashboard (claimRef: string): void {
    this.viewOfferFromDashboard(claimRef)
    this.acceptOffer()
  }

  rejectOfferFromDashboard (claimRef: string): void {
    this.viewOfferFromDashboard(claimRef)
    this.rejectOffer()
  }

  countersignAgreement (): void {
    I.click('Sign the settlement agreement')
    I.click('Make an agreement')
    this.signAgreement()
    I.see('You’ve both signed a settlement agreement')
  }

  countersignOfferFromDashboard (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef)
    this.countersignAgreement()
  }

  viewOfferFromDashboard (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef)
    I.click('View and respond to the offer')
  }

  viewClaimFromDashboard (claimRef: string): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
  }

  private signAgreement (): void {
    I.checkOption('I confirm I’ve read and accept the terms of the agreement.')
    I.click('Sign and submit')
  }

}
