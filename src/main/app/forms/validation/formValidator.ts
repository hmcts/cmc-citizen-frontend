import * as express from 'express'
import { ValidationError, Validator } from '@hmcts/class-validator'

import { Form } from 'forms/form'
import * as _ from 'lodash'

type Constructor<T> = { new(): T }
type Mapper<T> = (value: any) => T

export class FormValidator {

  static requestHandler<T> (modelType: Constructor<T>, modelTypeMapper?: Mapper<T>, validationGroup?: string, actionsWithoutValidation?: string[]) {
    const validator: Validator = new Validator()

    if (!modelTypeMapper) {
      modelTypeMapper = (value: any): T => {
        return Object.assign(new modelType(), value)
      }
    }

    const isValidationEnabledFor = (req: express.Request): boolean => {
      if (actionsWithoutValidation && req.body.action) {
        const actionName = Object.keys(req.body.action)[0]
        return actionsWithoutValidation.indexOf(actionName) < 0
      }
      return true
    }

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const model: T = modelTypeMapper(removeIllegalCharacters(req.body))

      const errors: ValidationError[] = isValidationEnabledFor(req) ? await validator.validate(model, { groups: validationGroup !== undefined ? [validationGroup] : [] }) : []
      const action: object = req.body.action

      req.body = new Form<T>(model, errors, req.body)
      if (action) {
        req.body.action = action // Workaround to expose action to request handlers
      }

      next()
    }
  }

}

function removeIllegalCharacters (value) {
  if (value !== undefined
    && value.address !== undefined
    && value.address.postcode !== undefined) {
    value.address.postcode = value.address.postcode.trim().replace(/[\u202F\u00A0\u2000\u2001\u2003]/g, ' ')
  }

  if (value !== undefined
    && value.correspondenceAddress !== undefined
    && value.correspondenceAddress.postcode !== undefined) {
    value.correspondenceAddress.postcode = value.correspondenceAddress.postcode.trim().replace(/[\u202F\u00A0\u2000\u2001\u2003]/g, ' ')
  }

  if (typeof value === 'string') {
    // Used the same criteria for excluding characters as in pdf service:
    // https://github.com/hmcts/cmc-pdf-service/commit/0d329cdf316c4170505cea0b1d55fc9e955ef9ed#diff-33006e1cd375862451ac613046341e82R34
    return value.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, '')
  }

  if (typeof value === 'object') {
    return ((_.isArray(value) ? _.map : _.mapValues) as any)(value, removeIllegalCharacters)
  }

  return value
}
