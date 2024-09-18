/* tslint:disable:no-console */

import * as fs from 'fs'
import { request } from 'integration-test/helpers/clients/base/request'
import { RequestResponse } from 'request'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { Logger } from '@hmcts/nodejs-logging'

const citizenAppURL = process.env.CITIZEN_APP_URL
const logger = Logger.getLogger('idamClient')

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
  console.log('Error during bootstrap, exiting', error)
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
      console.log(`FEATURE_DIRECTIONS_QUESTIONNAIRE=${process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE}`)
      console.log(`FEATURE_INVERSION_OF_CONTROL=${process.env.FEATURE_INVERSION_OF_CONTROL}`)
      console.log(`FEATURE_PCQ=${process.env.FEATURE_PCQ}`)
      console.log(`dashboard_pagination_enabled=${process.env.dashboard_pagination_enabled}`)
      console.log(`AUTO_ENROLL_INTO_NEW_FEATURE=${process.env.AUTO_ENROLL_INTO_NEW_FEATURE}`)
      console.log(`FEATURE_HELP_WITH_FEES=${process.env.FEATURE_HELP_WITH_FEES}`)
      console.log(`FEATURE_BREATHING_SPACE=${process.env.FEATURE_BREATHING_SPACE}`)
      console.log(`CUI_DASHBOARD_REDIRECT=${process.env.CUI_DASHBOARD_REDIRECT}`)
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

async function createSmokeTestsUserIfDoesntExist (username: string, userRole: string, password: string): Promise<void> {
  let bearerToken
  try {
    console.log(`Authenticate user: ${username} `)
    bearerToken = await IdamClient.authenticateUser(username, password)
  } catch (error) {
    logger.warn(`Failed authenticate User for: ${username}`)
    logger.warn(`Status Code: ${error.statusCode}`)
    logger.warn(`Status Message: ${error.statusMessage}`)
    if (!(username || password)) {
      return
    }
    try {
      await IdamClient.createUser(username, userRole, password)
    } catch (err) {
      if (err && err.statusCode === 409) {
        logger.info(`ERROR:: User ${username} already exists.`)
      } else {
        throw err
      }
    }
    bearerToken = await IdamClient.authenticateUser(username, password)
  }

  try {
    await ClaimStoreClient.addRoleToUser(bearerToken, 'cmc-new-features-consent-given')
  } catch (err) {
    if (err && err.statusCode === 409) {
      logger.log(`User ${username} already has user consent role`)
      return
    }
    logger.log(`Failed to add user ${username} consent role`)
    throw err
  }
  logger.info(`Test user created: ${username}`)
}

module.exports = {
  bootstrapAll: async function (claimantEmail: string, defendantEmail: string) {
    try {
      await waitTillHealthy(citizenAppURL)
      if (process.env.IDAM_URL) {
        if (process.env.SMOKE_TEST_CITIZEN_USERNAME) {
          await Promise.all([
            createSmokeTestsUserIfDoesntExist(process.env.SMOKE_TEST_CITIZEN_USERNAME, 'citizen', process.env.SMOKE_TEST_USER_PASSWORD),
            createSmokeTestsUserIfDoesntExist(claimantEmail, 'citizen', process.env.SMOKE_TEST_USER_PASSWORD),
            createSmokeTestsUserIfDoesntExist(defendantEmail, 'citizen', process.env.SMOKE_TEST_USER_PASSWORD)
          ])
        }
      }
    } catch (error) {
      handleError(error)
    }
  }
}
