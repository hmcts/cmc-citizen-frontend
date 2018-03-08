import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class ClaimStoreHelper extends codecept_helper {

  async createClaim (claimData: ClaimData, submitterEmail: string): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)

    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter)

    return referenceNumber
  }

  async linkDefendantToClaim (referenceNumber: string, ownerEmail: string, defendantEmail: string): Promise<void> {
    const owner: User = await this.prepareAuthenticatedUser(ownerEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(referenceNumber, owner)

    const defendant: User = await this.prepareAuthenticatedUser(defendantEmail)
    await ClaimStoreClient.linkDefendant(claim.externalId, defendant)
  }

  async respondToClaim (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string): Promise<void> {
    const owner: User = await this.prepareAuthenticatedUser(ownerEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(referenceNumber, owner)

    const defendant: User = await this.prepareAuthenticatedUser(defendantEmail)
    await ClaimStoreClient.respond(claim.externalId, responseData, defendant)
  }

  private async prepareAuthenticatedUser (userEmail: string): Promise<User> {
    const jwt: string = await IdamClient.authorizeUser(userEmail)
    const user: User = await IdamClient.retrieveUser(jwt)
    return { ...user, bearerToken: jwt }
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = ClaimStoreHelper
