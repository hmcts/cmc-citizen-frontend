import { expect } from 'chai'
import * as _ from 'lodash'

import { ValidationError } from 'class-validator'
import * as randomstring from 'randomstring'

class Violation {
  constructor (public property: string, public message: string) {
  }
}

export function expectNumberOfValidationErrors (errors: ValidationError[], expectation: number) {
  expect(errors.length).to.be.equal(expectation, `Number of errors found (${errors.length}) is not equal ${expectation}. The following errors has been triggered: ${stringifyViolations(extractViolationsFrom(errors))}\n`)
}

export function expectValidationError (errors: ValidationError[], message: string) {
  const violations: Violation[] = extractViolationsFrom(errors)
  expect(violations.map(violation => violation.message)).to.include(message, `Error '${message}' has not been found. The following errors has been triggered: ${stringifyViolations(violations)}\n`)
}

export function expectPropertyValidationError (errors: ValidationError[], property: string, message: string) {
  const violations: Violation[] = extractViolationsFrom(errors)
  expect(violations).to.deep.include(new Violation(property, message), `Error '${message}' on property '${property}' has not been found. The following errors has been triggered: ${stringifyViolations(violations)}\n`)
}

function extractViolationsFrom (errors: ValidationError[], parentProperty?: string): Violation[] {
  function property (error: ValidationError) {
    return parentProperty ? `${parentProperty}.${error.property}` : error.property
  }

  return _.flattenDeep<Violation>(
    errors.map((error: ValidationError) => {
      if (error.children && error.children.length > 0) {
        return extractViolationsFrom(error.children, parentProperty)
      } else {
        return Object.values(error.constraints).map((message: string) => new Violation(property(error), message))
      }
    })
  )
}

/**
 * Returns string containing list of violations grouped by property e.g.
 *
 * <ul>
 *  <li>property 'date':
 *   <ul>
 *     <li>'Enter date before 3 January 2018'</li>
 *   </ul>
 *  </li>
 *  <li>property 'text':
 *   <ul>
 *     <li>'Explain why you don’t owe the full amount'</li>
 *     <li>'You’ve entered too many characters'</li>
 *   </ul>
 *  </li>
 * </ul>
 */
function stringifyViolations (violations: Violation[]): string {
  return _(violations)
    .groupBy((violation: Violation) => violation.property)
    .map((violations: Violation[], property: string) => {
      return `\n - property '${property}': ${violations.map(violation => `\n  - '${violation.message}'`)}`
    })
    .join('')
}

export function generateString (length: number): string {
  return randomstring.generate({
    length: length,
    charset: 'alphabetic'
  })
}

export function evaluateErrorMsg (errorMsg: string, value: number): string {
  return errorMsg.replace('$constraint1', value.toString())
}
