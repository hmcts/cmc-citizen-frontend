/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'

module.exports = {
  teardownAll: async function (claimantEmail, defendantEmail) {
    console.log('teardownAll...')
    if (process.env.IDAM_URL) {
      if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
        console.log('Deleting test users...')
        claimantEmail !== undefined ? await IdamClient.deleteUser(claimantEmail) : console.log("claimantEmail is undefined")
        defendantEmail !== undefined ? await IdamClient.deleteUser(defendantEmail) : console.log("defendantEmail is undefined")
        claimantEmail !== undefined && defendantEmail !== undefined ?
          await IdamClient.deleteUsers([claimantEmail, defendantEmail]) : console.log("claimantEmail and defendantEmail is undefined")
      }
    }
  }
}

// @ts-ignore
function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
