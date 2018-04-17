import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class ClaimStoreHelper extends codecept_helper {

  async createClaim (claimData: ClaimData, submitterEmail: string): Promise<string> {

    console.log('auth user', submitterEmail)
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)

    console.log('I create claim')

    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter)

    console.log('I have just created claim', referenceNumber)

    return referenceNumber
  }

  async linkDefendantToClaim (claimRef: string, claimantEmail: string, defendantEmail: string): Promise<void> {
    const claimantBearerToken = await IdamClient.authenticateUser(claimantEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(claimRef, { bearerToken: claimantBearerToken })
    const pinResponse = await IdamClient.getPin(claim.letterHolderId)
    const upliftToken = await IdamClient.authenticatePinUser(pinResponse.body)
    const defendantBearerToken = await IdamClient.upliftUser(defendantEmail, upliftToken)

    await ClaimStoreClient.linkDefendant({ bearerToken: defendantBearerToken }, claim.externalId)
  }

  async respondToClaim (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string): Promise<void> {
    const owner: User = await this.prepareAuthenticatedUser(ownerEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(referenceNumber, owner)

    const defendant: User = await this.prepareAuthenticatedUser(defendantEmail)
    await ClaimStoreClient.respond(claim.externalId, responseData, defendant)
  }

  private async prepareAuthenticatedUser (userEmail: string): Promise<User> {
    const jwt: string = await IdamClient.authenticateUser(userEmail)

    console.log('auth token', jwt)

    const user: User = await IdamClient.retrieveUser(jwt)

    console.log('This is my user:', user)

    return { ...user, bearerToken: jwt }
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = ClaimStoreHelper
