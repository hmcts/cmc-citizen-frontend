'use strict'

const event = require('codeceptjs/lib/event')
const container = require('codeceptjs/lib/container')
const request = require('request-promise-native')

const SUCCESS = true
const FAILURE = false

function reportBuildResultToSaucelabs (result) {
  const sessionId = container.helpers('WebDriver').browser.sessionId
  const sauceUsername = process.env.SAUCE_USERNAME

  request.put({
    uri: `https://eu-central-1.saucelabs.com/rest/v1/${sauceUsername}/jobs/${sessionId}`,
    auth: {
      username: process.env.SAUCE_USERNAME,
      password: process.env.SAUCE_ACCESS_KEY
    },
    body: {
      passed: result
    },
    json: true
  }).then(
    () => console.log(`Test status set to ${result === SUCCESS ? 'success' : 'failure'} for Saucelabs job ${sessionId}`)
  ).catch(
    err => console.log(err)
  )
  console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=cmc-citizen-frontend')
}

module.exports = function () {
  event.dispatcher.on(event.test.passed, () => {
    reportBuildResultToSaucelabs(SUCCESS)
  })

  event.dispatcher.on(event.test.failed, () => {
    reportBuildResultToSaucelabs(FAILURE)
  })
}
