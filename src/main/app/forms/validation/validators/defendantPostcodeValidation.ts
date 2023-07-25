import { 
    ValidationArguments, 
    ValidatorConstraint, 
    ValidatorConstraintInterface,
    ValidationOptions,
    registerDecorator
 } from '@hmcts/class-validator'

@ValidatorConstraint()
export class DefendantPostcodeValidation implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        if (value == undefined || value.length < 5){
            return false
        }
        return true
    }
}
export function IsPostCodeLengthValid (validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [0],
        validator: DefendantPostcodeValidation
        })
    }
}
