/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { UserEmails } from 'integration-test/data/test-data'

const userEmails: UserEmails = new UserEmails()

module.exports = {
  teardownAll: async function (done) {
    try {
      if (process.env.IDAM_URL) {
        if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
          await Promise.all([
            console.log('Deleting test users...'),
            IdamClient.deleteUser(userEmails.getDefendant()),
            IdamClient.deleteUser(userEmails.getClaimant()),
            IdamClient.deleteUsers([userEmails.getClaimant(), userEmails.getDefendant()])
          ])
        }
      }
    } catch (error) {
      handleError(error)
    }
    done()
  }
}

function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
