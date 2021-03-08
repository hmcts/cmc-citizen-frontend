/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'

module.exports = {
  teardownAll: async function (claimantEmail, defendantEmail) {
    try {
      if (process.env.IDAM_URL) {
        if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
          await Promise.all([
            console.log('Deleting test users...'),
            IdamClient.deleteUser(claimantEmail),
            IdamClient.deleteUser(defendantEmail),
            IdamClient.deleteUsers([claimantEmail, defendantEmail])
          ])
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
