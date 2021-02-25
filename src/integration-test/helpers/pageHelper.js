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

// eslint-disable-next-line camelcase
let Helper = codecept_helper

// eslint-disable-next-line no-unused-vars
class PageHelper extends Helper {

  amOnCitizenAppPage (path) {
    return this.helpers['WebDriver'].amOnPage(`${citizenAppBaseURL}${path}`)
  }

  checkForIE11() {
    return this.helpers['WebDriver'].config.browser === 'internet explorer'
  }

  waitIfOnSafari() {
    const helper = this.helpers['WebDriver']
    if (helper.config.browser === 'safari') {
      return this.helpers['WebDriver'].wait(5)
    }
  }
}

module.exports = PageHelper
