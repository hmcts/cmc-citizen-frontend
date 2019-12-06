/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { UserEmails } from 'integration-test/data/test-data'

const userEmails: UserEmails = new UserEmails()

module.exports = {
  teardownAll: function (done) {
    try {
      if (process.env.IDAM_URL) {
        if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
          IdamClient.deleteUser(userEmails.getDefendant())
          IdamClient.deleteUser(userEmails.getClaimant())
        }
      }
    } catch (error) {
      handleError(error)
    }
  }
}

function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
