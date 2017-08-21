import { expect } from 'chai'
import * as _ from 'lodash'

import { ValidationError } from 'class-validator'

class Violation {
  constructor (public property: string, public message: string) {
  }
}

export function expectValidationError (errors: ValidationError[], message: string) {
  const messages: string[] = extractViolationsFrom(errors).map(violation => violation.message)
  expect(messages).to.contain(message, `Error '${message}' has not been triggered. The following errors has been triggered instead: ${messages}`)
}

export function expectPropertyValidationError (errors: ValidationError[], property: string, message: string) {
  const violations: Violation[] = extractViolationsFrom(errors)
  expect(violations).to.deep.include(new Violation(property, message))
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
