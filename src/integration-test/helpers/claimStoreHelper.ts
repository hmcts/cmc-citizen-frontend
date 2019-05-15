import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class ClaimStoreHelper extends codecept_helper {

  async createClaim (claimData: ClaimData, submitterEmail: string): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)
    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter, ['admissions'])

    return referenceNumber
  }

  async createClaimWithFeatures (claimData: ClaimData, submitterEmail: string, features: string[] = ['admissions']): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)
    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter, features)

    return referenceNumber
  }

  async createClaimWithFeaturesAndRole (claimData: ClaimData, submitterEmail: string, role: string, features: string[] = ['admissions']): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)
    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter, features)
    await ClaimStoreClient.addRoleToUser(submitter.bearerToken, role)

    return referenceNumber
  }

  async linkDefendantToClaim (claimRef: string, claimantEmail: string, defendantEmail: string): Promise<void> {
    const claimantBearerToken = await IdamClient.authenticateUser(claimantEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(claimRef, { bearerToken: claimantBearerToken })
    const pinResponse = await IdamClient.getPin(claim.letterHolderId)
    const upliftToken = await IdamClient.authenticatePinUser(pinResponse)
    await IdamClient.upliftUser(defendantEmail, upliftToken)
    const defendant: User = await this.prepareAuthenticatedUser(defendantEmail)
    await ClaimStoreClient.linkDefendant(defendant)
  }

  async respondToClaim (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string): Promise<void> {
    const owner: User = await this.prepareAuthenticatedUser(ownerEmail)
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(referenceNumber, owner)

    const defendant: User = await this.prepareAuthenticatedUser(defendantEmail)
    await ClaimStoreClient.respond(claim.externalId, responseData, defendant)
  }

  private async prepareAuthenticatedUser (userEmail: string): Promise<User> {
    const jwt: string = await IdamClient.authenticateUser(userEmail)
    const user: User = await IdamClient.retrieveUser(jwt)

    return { ...user, bearerToken: jwt }
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = ClaimStoreHelper
