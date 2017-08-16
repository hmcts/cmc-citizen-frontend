import {
  registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class MinTotalConstraint implements ValidatorConstraintInterface {

  validate (value: any, validationArguments?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }
    if (!Array.isArray(value)) {
      throw new Error('Expected validated element to be an array')
    }

    const minValue: number = this.extractMinValue(validationArguments)
    let total: number = 0
    for (let row of value) {
      if (typeof row.amount === 'number') {
        total += row.amount
      }
    }
    return total >= minValue
  }

  private extractMinValue (validationArguments?: ValidationArguments): number {
    const [minValue] = validationArguments.constraints
    if (typeof minValue !== 'number') {
      throw new Error('Minimal required value parameter not given')
    }
    return minValue
  }

}

export function MinTotal (minValue: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minValue],
      validator: MinTotalConstraint
    })
  }
}
