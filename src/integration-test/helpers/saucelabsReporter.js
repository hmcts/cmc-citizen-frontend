'use strict'

const event = require('codeceptjs/lib/event')
const container = require('codeceptjs/lib/container')
const request = require('request-promise-native')

const SUCCESS = true
const FAILURE = false

function reportBuildResultToSaucelabs (result) {
  const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID

  request.put({
    uri: `https://saucelabs.com/rest/v1/${process.env.SAUCELABS_USERNAME}/jobs/${sessionId}`,
    auth: {
      username: process.env.SAUCELABS_USERNAME,
      password: process.env.SAUCELABS_ACCESS_KEY
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
}

module.exports = function () {
  event.dispatcher.on(event.test.passed, () => {
    reportBuildResultToSaucelabs(SUCCESS)
  })

  event.dispatcher.on(event.test.failed, () => {
    reportBuildResultToSaucelabs(FAILURE)
  })
}
