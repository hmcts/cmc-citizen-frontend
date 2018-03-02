'use strict'
/* globals codecept_helper */

function normalizeURL (url) {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1)
  } else {
    return url
  }
}

const citizenAppBaseURL = normalizeURL(process.env.CITIZEN_APP_URL || 'https://localhost:3000')
const legalAppBaseURL = normalizeURL(process.env.LEGAL_APP_URL || 'https://localhost:4000/legal')

// eslint-disable-next-line camelcase
let Helper = codecept_helper

// eslint-disable-next-line no-unused-vars
class PageHelper extends Helper {

  amOnCitizenAppPage (path) {
    return this.helpers['WebDriverIO'].amOnPage(`${citizenAppBaseURL}${path}`)
  }

  amOnLegalAppPage (path) {
    return this.helpers['WebDriverIO'].amOnPage(`${legalAppBaseURL}${path}`)
  }

}

module.exports = PageHelper
