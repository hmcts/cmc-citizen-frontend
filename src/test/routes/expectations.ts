import * as chai from 'chai'
import * as cookie from 'cookie'
import * as _ from 'lodash'
import * as HttpStatus from 'http-status-codes'

const Assertion = chai['Assertion']

function stringifyWithoutPropertyQuotes (value: object, pretty: boolean = false): string {
  let result = JSON.stringify(value, null, 2)
  if (!pretty) {
    result = result.replace(/\n\s*/g, ' ') // remove new line characters and normalize spaces
  }
  return result.replace(/\"([^(\")"]+)\":/g, '$1:')
}

function errorMessageWithResponseExtract (msg: string, res: any): string {
  const responseExtract = {
    statusCode: res.statusCode,
    headers: res.headers,
    text: res.text ? res.text.replace(/\n+\s*/g, '') : undefined
  }

  return `${msg} - see response extract below:\n${stringifyWithoutPropertyQuotes(responseExtract, true)}`
}

function statusCodeInRangeAssertion (expectedStatusCodes: number[]) {
  return function () {
    const res = this._obj

    this.assert(
      _.includes(expectedStatusCodes, res.statusCode)
      , errorMessageWithResponseExtract('expected response status code to be in #{exp} range but got #{act}', res)
      , errorMessageWithResponseExtract('expected response status code to not be #{act}', res)
      , expectedStatusCodes.join(', ') // expected
      , res.statusCode // actual
    )
  }
}

/**
 * Checks whether response status code is within supported successful (2xx) range
 */
Assertion.addProperty('successful', statusCodeInRangeAssertion([
  HttpStatus.OK
]))

/**
 * Checks whether response status code is within supported redirect (3xx) range
 */
Assertion.addProperty('redirect', statusCodeInRangeAssertion([
  HttpStatus.MOVED_TEMPORARILY
]))

/**
 * Checks whether response status code is bad request
 */
Assertion.addProperty('badRequest', statusCodeInRangeAssertion([
  HttpStatus.BAD_REQUEST
]))

/**
 * Checks whether response status code is forbidden
 */
Assertion.addProperty('forbidden', statusCodeInRangeAssertion([
  HttpStatus.FORBIDDEN
]))

/**
 * Checks whether response status code is not found
 */
Assertion.addProperty('notFound', statusCodeInRangeAssertion([
  HttpStatus.NOT_FOUND
]))

/**
 * Checks whether response status code is within supported server error (5xx) range
 */
Assertion.addProperty('serverError', statusCodeInRangeAssertion([
  HttpStatus.INTERNAL_SERVER_ERROR
]))

/**
 * Checks whether response 'location' header matches specified location
 */
Assertion.addMethod('toLocation', function (location: string | RegExp) {
  const res = this._obj

  if (_.isRegExp(location)) {
    this.assert(
      location.test(res.header['location'])
      , errorMessageWithResponseExtract('expected redirect location to match #{exp} pattern but got #{act}', res)
      , errorMessageWithResponseExtract('expected redirect location to not match #{act}', res)
      , location.source // expected
      , res.header['location'] // actual
    )
  } else {
    this.assert(
      res.header['location'] === location
      , errorMessageWithResponseExtract('expected redirect location to be #{exp} but got #{act}', res)
      , errorMessageWithResponseExtract('expected redirect location to not be #{act}', res)
      , location // expected
      , res.header['location'] // actual
    )
  }
})

/**
 * Checks whether response has text
 */
Assertion.addMethod('withText', function (...texts: string[]) {
  const res = this._obj

  this.assert(
    _.every(texts, (text) => res.text.includes(text))
    , errorMessageWithResponseExtract('expected response text to include #{exp} but got #{act}', res)
    , errorMessageWithResponseExtract('expected response text to include #{act}', res)
    , texts.join(', ') // expected
    , res.text.replace(/\n+\s*/g, '') // actual
  )
})

/**
 * Checks whether response does not have text
 */
Assertion.addMethod('withoutText', function (...texts: string[]) {
  const res = this._obj

  this.assert(
    _.every(texts, (text) => !res.text.includes(text))
    , errorMessageWithResponseExtract('expected response text to not include #{exp} but got #{act}', res)
    , errorMessageWithResponseExtract('expected response text to not include #{act}', res)
    , texts.join(', ') // expected
    , res.text.replace(/\n+\s*/g, '') // actual
  )
})

/**
 * Checks whether response 'set-cookie' header exists for given cookie name and value
 */
Assertion.addMethod('cookie', function (cookieName: string, cookieValue: string) {
  const res = this._obj

  const actualCookies: object[] = res.header['set-cookie'].map(_ => cookie.parse(_))

  // Lax due to https://github.com/aspnet/Security/issues/1231
  const expectedCookie: object = { [cookieName]: cookieValue, path: '/' }
  if (cookieValue === '') {
    expectedCookie['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT'
  }

  this.assert(
    _.some(actualCookies, (item) => _.isEqual(item, expectedCookie))
    , errorMessageWithResponseExtract('expected response to set cookie #{exp} but got #{act}', res)
    , errorMessageWithResponseExtract('expected response not to set cookie #{exp}', res)
    , stringifyWithoutPropertyQuotes(expectedCookie) // expected
    , stringifyWithoutPropertyQuotes(actualCookies) // actual
  )
})
