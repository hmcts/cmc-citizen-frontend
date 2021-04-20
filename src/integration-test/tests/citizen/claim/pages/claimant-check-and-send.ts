import { PartyType } from 'integration-test/data/party-type'
import { claimAmount, claimFee, claimReason, createClaimant, createDefendant } from 'integration-test/data/test-data'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'

const I: I = actor()

const fields = {
  checkboxFactsTrue: 'input#signedtrue',
  signerName: 'input[id=signerName]',
  signerRole: 'input[id=signerRole]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantCheckAndSendPage {

  open (type: string): void {
    I.amOnCitizenAppPage('/claim/check-and-send')
  }

  signStatementOfTruthAndSubmit (signerName: string, signerRole: string): void {
    I.fillField(fields.signerName, signerName)
    I.fillField(fields.signerRole, signerRole)
    this.checkFactsTrueAndSubmit()
  }

  checkFactsTrueAndSubmit (): void {
    I.checkOption(fields.checkboxFactsTrue)
    I.click(buttons.submit)
  }

  verifyClaimantCheckAndSendAnswers (claimant: Party, claimantType: PartyType): void {
    I.see(claimant.address.line1)
    I.see(claimant.address.city)
    I.see(claimant.address.postcode)
    I.see(claimant.correspondenceAddress.line1)
    I.see(claimant.correspondenceAddress.line2)
    I.see(claimant.correspondenceAddress.city)
    I.see(claimant.correspondenceAddress.postcode)
    switch (claimantType) {

      case PartyType.INDIVIDUAL:
        I.see(claimant.name)
        // todo have to convert numeric month to full text month I.see(claimant.dateOfBirth)
        break
      case PartyType.SOLE_TRADER:
        I.see(claimant.name)
        break
      case PartyType.COMPANY:
        I.see(claimant.name)
        I.see(claimant.contactPerson)
        break
      case PartyType.ORGANISATION:
        I.see(claimant.name)
        I.see(claimant.contactPerson)
        break
      default:
        throw new Error('non-matching claimant type for claim')
    }
    I.see(claimant.phone)
    I.see(claimReason)
  }

  async verifyDefendantCheckAndSendAnswers (I: I, defendantType: PartyType, enterDefendantEmail: boolean = true): Promise<void> {
    const defendant: Party = await createDefendant(I, defendantType, enterDefendantEmail)

    I.see(defendant.address.line1)
    I.see(defendant.address.line2)
    I.see(defendant.address.city)
    I.see(defendant.address.postcode)
    switch (defendantType) {

      case PartyType.INDIVIDUAL:
        I.see(defendant.title)
        I.see(defendant.firstName)
        I.see(defendant.lastName)
        break
      case PartyType.SOLE_TRADER:
        I.see(defendant.firstName)
        I.see(defendant.lastName)
        break
      case PartyType.COMPANY:
        I.see(defendant.name)
        break
      case PartyType.ORGANISATION:
        I.see(defendant.name)
        break
      default:
        throw new Error('non-matching defendant Type type for claim')
    }
    if (enterDefendantEmail) {
      I.see(defendant.email)
    }
  }

  verifyClaimAmount (): void {
    I.see(AmountHelper.formatMoney(claimAmount.getClaimTotal()))
    I.see(AmountHelper.formatMoney(claimFee))
    I.see(AmountHelper.formatMoney(claimAmount.getTotal()))
  }

  async verifyCheckAndSendAnswers (I: I, claimantType: PartyType, defendantType: PartyType, enterDefendantEmail: boolean = true): Promise<void> {
    const claimant: Party = createClaimant(claimantType)

    I.waitForText('Check your answers')
    this.verifyClaimantCheckAndSendAnswers(claimant, claimantType)
    await this.verifyDefendantCheckAndSendAnswers(I, defendantType, enterDefendantEmail)
    this.verifyClaimAmount()
  }

}
