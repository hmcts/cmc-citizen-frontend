/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'

module.exports = {
  teardownAll: async function (claimantEmail, defendantEmail) {
    console.log('teardownAll...')
    try {
      if (process.env.IDAM_URL) {
        if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
          console.log('Deleting test users...')
          await IdamClient.deleteUser(claimantEmail)
          await IdamClient.deleteUser(defendantEmail)
          await IdamClient.deleteUsers([claimantEmail, defendantEmail])
        }
      }
    } catch (error) {
      console.error('Error during teardown, exiting', error)
    }
  }
}

// @ts-ignore
function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
