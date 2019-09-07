/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'

module.exports = async function (done: () => void) {
  try {
    const result = await IdamClient.deleteUsers()
    console.log('Teardown finished: ' + result)
  } catch (error) {
    handleError(error)
  }
  done()
}

function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
