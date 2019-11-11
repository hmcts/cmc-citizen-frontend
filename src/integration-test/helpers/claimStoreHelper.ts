import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { request } from './clients/base/request'
import { UserEmails } from 'integration-test/data/test-data'

const baseURL: string = process.env.CLAIM_STORE_URL

const userEmails: UserEmails = new UserEmails()

class ClaimStoreHelper extends codecept_helper {

  async waitForOpenClaim (referenceNumber: string): Promise<boolean> {
    const maxAttempts: number = 120 // 60 seconds
    let isClaimOpen: boolean = false
    let attempts: number = 0
    do {
      attempts++
      isClaimOpen = await ClaimStoreClient.isOpen(referenceNumber)
      await this.sleep(500)
    } while (!isClaimOpen && attempts < maxAttempts)
    return isClaimOpen
  }

  async createClaim (claimData: ClaimData, submitterEmail: string, linkDefendant: boolean = true, features: string[] = ['admissions','directionsQuestionnaire'], role: string): Promise<string> {
    const submitter: User = await this.prepareAuthenticatedUser(submitterEmail)
    const { referenceNumber } = await ClaimStoreClient.create(claimData, submitter, features)
    await this.waitForOpenClaim(referenceNumber)

    if (linkDefendant) {
      await this.linkDefendant(referenceNumber)
    }

    return referenceNumber
  }

  private async linkDefendant (referenceNumber) {
    let password = process.env.SMOKE_TEST_USER_PASSWORD
    let defendant = userEmails.getDefendant()
    let uri = `${baseURL}/testing-support/claims/${referenceNumber}/defendant/${defendant}/${password}`

    await request.put(uri, {}).promise()
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
