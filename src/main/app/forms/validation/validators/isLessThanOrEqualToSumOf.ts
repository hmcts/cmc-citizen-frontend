import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class IsLessThanOrEqualToSumOfConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }
    const argsLength = args.constraints.length
    const expectedNumberOfArgs = 2
    if (argsLength !== expectedNumberOfArgs) {
      throw new Error(`Invalid number of arguments, got ${argsLength}, expected ${expectedNumberOfArgs}`)
    }

    const amountToSumProperty = args.constraints[0]
    const lessThanAmountPropertyName = args.constraints[1]

    const lessThanAmount = (args.object as any)[lessThanAmountPropertyName]
    const amountToSum = (args.object as any)[amountToSumProperty]

    // Not this validator's concern if the amount hasn't been entered
    if (!amountToSum) {
      return true
    }

    return typeof value === 'number'
      && typeof lessThanAmount === 'number'
      && typeof amountToSum === 'number'
      && (value + amountToSum) <= lessThanAmount
  }
}

/**
 * This validator is for ensuring that a number added with another number is less than the 'lessThanAmount'.
 *
 * @param {string} sum the property name of the amount to sum with 'value'
 * @param {string} lessThanAmount the property name of the amount that 'value' + 'sum' has to be less than
 * @param {ValidationOptions} validationOptions the options
 * @returns {(object: Object, propertyName: string) => any} the validation function
 * @constructor
 */
export function IsLessThanOrEqualToSumOf (sum: string, lessThanAmount: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsLessThanOrEqualToSumOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [sum, lessThanAmount],
      options: validationOptions,
      validator: IsLessThanOrEqualToSumOfConstraint
    })
  }
}
