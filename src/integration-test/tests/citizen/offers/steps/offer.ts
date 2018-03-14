import { offer } from 'integration-test/data/test-data'
import { DefendantOfferPage } from 'integration-test/tests/citizen/offers/pages/defendant-offer'
import I = CodeceptJS.I

const I: I = actor()
const defendantOfferPage: DefendantOfferPage = new DefendantOfferPage()

export class OfferSteps {

  makeOffer (): void {
    defendantOfferPage.enterOffer(offer.offerText, offer.completionDate)
  }

  makeOfferFromDashboard (claimRef: string): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
    I.click('make an offer')
    this.makeOffer()
  }

  acceptOffer (): void {
    I.checkOption('Yes')
    I.click('Continue')
    I.click('Make an agreement')
    this.signAgreement()
    I.see('You’ve signed the agreement')
  }

  acceptOfferFromDashboard (claimRef: string): void {
    this.viewOfferFromDashboard(claimRef)
    this.acceptOffer()
  }

  countersignAgreement (): void {
    I.click('Sign the agreement')
    I.click('View the agreement')
    this.signAgreement()
    I.see('You’ve settled out of court')
  }

  countersignOfferFromDashboard (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef)
    this.countersignAgreement()
  }

  viewOfferFromDashboard (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef)
    I.click('View their offer')
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
