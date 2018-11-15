/* tslint:disable:no-console */

import * as fs from 'fs'
import { request } from 'integration-test/helpers/clients/base/request'
import { RequestResponse } from 'request'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'

const citizenAppURL = process.env.CITIZEN_APP_URL

class Client {
  static checkHealth (appURL: string): Promise<RequestResponse> {
    return request.get({
      uri: `${appURL}/health`,
      resolveWithFullResponse: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('./src/integration-test/resources/localhost.crt')
    }).catch((error) => {
      return error
    })
  }
}

// TS:no-
function logStartupProblem (response) {
  if (response.body) {
    console.log(response.body)
  } else if (response.message) {
    console.log(response.message)
  }
}

function handleError (error) {
  const errorBody = () => {
    return error && error.response ? error.response.body : error
  }
  console.log('Error during bootstrap, exiting', errorBody())
  process.exit(1)
}

function sleepFor (sleepDurationInSeconds: number) {
  console.log(`Sleeping for ${sleepDurationInSeconds} seconds`)
  return new Promise((resolve) => {
    setTimeout(resolve, sleepDurationInSeconds * 1000)
  })
}

async function waitTillHealthy (appURL: string) {
  const maxTries = 36
  const sleepInterval = 10

  console.log(`Verifying health for ${appURL}`)

  let response: RequestResponse
  for (let i = 0; i < maxTries; i++) {
    response = await Client.checkHealth(appURL)
    console.log(`Attempt ${i + 1} - received status code ${response.statusCode} from ${appURL}/health`)

    if (response.statusCode === 200) {
      console.log(`Service ${appURL} became ready after ${sleepInterval * i} seconds`)
      console.log(`FEATURE_ADMISSIONS=${process.env.FEATURE_ADMISSIONS}`)
      return Promise.resolve()
    } else {
      logStartupProblem(response)
      await sleepFor(sleepInterval)
    }
  }

  const error = new Error(`Failed to successfully contact ${appURL} after ${maxTries} attempts`)
  error.message = '' + response
  return Promise.reject(error)
}

async function createSmokeTestsUserIfDoesntExist (username: string, userGroup: string, password: string): Promise<void> {
  let bearerToken
  try {
    bearerToken = await IdamClient.authenticateUser(username, password)
  } catch {
    if (!(username || password)) {
      return
    }

    await IdamClient.createUser(username, userGroup, password)
    bearerToken = await IdamClient.authenticateUser(username, password)
  }

  try {
    await ClaimStoreClient.addRoleToUser(bearerToken, 'cmc-new-features-consent-given')
  } catch (err) {
    if (err && err.statusCode === 409) {
      console.log('User already has user consent role')
      return
    }
    console.log('Failed to add user consent role')
    throw err
  }
}

module.exports = async function (done: () => void) {
  try {
    await waitTillHealthy(citizenAppURL)
    if (process.env.IDAM_URL) {
      if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
        await createSmokeTestsUserIfDoesntExist(process.env.SMOKE_TEST_CITIZEN_USERNAME, 'cmc-private-beta', process.env.SMOKE_TEST_USER_PASSWORD)
      }
    }
  } catch (error) {
    handleError(error)
  }
  done()
}
