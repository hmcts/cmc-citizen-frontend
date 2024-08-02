import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { request } from './clients/base/request'

const baseURL: string = process.env.CLAIM_STORE_URL

class ClaimStoreHelper extends codecept_helper {

  async waitForOpenClaim (referenceNumber: string): Promise<boolean> {
    const maxAttempts: number = 3
    let isClaimOpen: boolean = false
    let attempts: number = 0
    do {
      attempts++
      isClaimOpen = await ClaimStoreClient.isOpen(referenceNumber)
      await this.sleep(2000)
    } while (!isClaimOpen && attempts < maxAttempts)
    return isClaimOpen
  }

  async createClaim (claimData: ClaimData, submitterEmail: string, linkDefendant: boolean = true, features: string[] = ['admissions','directionsQuestionnaire'], defendantEmail: string): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)
    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter, features)
    await this.waitForOpenClaim(referenceNumber)

    if (linkDefendant) {
      await this.linkDefendant(referenceNumber)
    }

    return referenceNumber
  }

  private async linkDefendant (referenceNumber) {
    const password = process.env.SMOKE_TEST_USER_PASSWORD
    // @ts-ignore
    const defendant: string = this.config.defendantEmail
    const uri = `${baseURL}/testing-support/claims/${referenceNumber}/defendant`

    await request.put({
      uri: uri,
      body: {
        'username': defendant,
        'password': password
      },
      json: true
    }).promise()
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

  private sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = ClaimStoreHelper
