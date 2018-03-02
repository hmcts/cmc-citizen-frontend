'use strict'
/* globals codecept_helper */

const fs = require('fs')
const path = require('path')
const request = require('request-promise-native')

// eslint-disable-next-line camelcase
let Helper = codecept_helper

class DownloadPdfHelper extends Helper {
  downloadPDF (url, sessionId) {
    // couldn't get loading the CA cert to verify correctly for some reason
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    const j = request.jar()
    const cookie = request.cookie('T2_SESSION_ID=' + sessionId)
    j.setCookie(cookie, 'https://www-legal.moneyclaim.reform.hmcts.net:4000')

    return request.get({
      uri: url,
      jar: j
    }).pipe(fs.createWriteStream(path.join(__dirname, '..', '..', 'output', 'legalClaim.pdf')))
  }
}

module.exports = DownloadPdfHelper
