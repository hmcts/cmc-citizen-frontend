/* tslint:disable:no-console */

// import { IdamClient } from 'integration-test/helpers/clients/idamClient'

module.exports = async function (done: () => void) {
  try {
    // await IdamClient.deleteUser('civilmoneyclaims+citizen-claimant@gmail.com')
    // await IdamClient.deleteUser('civilmoneyclaims+citizen-defendant@gmail.com')
    console.log('Teardown finished')
  } catch (error) {
    handleError(error)
  }
  done()
}

function handleError (error) {
  console.log('Error during teardown, exiting', error)
  process.exit(1)
}
