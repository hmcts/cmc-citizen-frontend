import * as express from 'express'
import { Validator, ValidationError } from 'class-validator'

import { Form } from 'forms/form'

type Constructor<T> = { new(): T }
type Mapper<T> = (value: any) => T

export class FormValidator {

  static requestHandler<T> (modelType: Constructor<T>, modelTypeMapper?: Mapper<T>, actionsWithoutValidation?: string[]): express.RequestHandler {
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

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const model: T = modelTypeMapper(req.body)

      const errors: ValidationError[] = isValidationEnabledFor(req) ? validator.validateSync(model) : []

      const action: object = req.body.action

      req.body = new Form<T>(model, errors)
      if (action) {
        req.body.action = action // Workaround to expose action to request handlers
      }

      next()
    }
  }

}
