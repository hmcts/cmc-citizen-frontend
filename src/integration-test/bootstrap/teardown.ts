/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
const userSteps: UserSteps = new UserSteps()

module.exports = async function (done: () => void) {
  try {
    await IdamClient.deleteUser(userSteps.getClaimantEmail())
    await IdamClient.deleteUser(userSteps.getDefendantEmail())
  } catch (error) {
    handleError(error)
  }
  done()
}

function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
