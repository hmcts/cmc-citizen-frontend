import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class IdamHelper extends codecept_helper {

  createCitizenUser (): Promise<string> {
    return this.createRandomUser('citizen')
  }

  private async createRandomUser (userRoleCode: string): Promise<string> {
    const email: string = this.generateRandomEmailAddress()
    await IdamClient.createUser(email, userRoleCode)

    return email
  }

  private generateRandomEmailAddress (): string {
    return `civilmoneyclaims+automatedtest-${require('randomstring').generate(7)}@gmail.com`
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper
