import { ValidateNested, ValidationError } from '@hmcts/class-validator'

import * as _ from 'lodash'

export class Converter {

  /**
   * Converts HTML form field in `foo[bar]` format to property in `foo.bar` format.
   */
  static asProperty (fieldName): string {
    return fieldName.replace(/\[/g, '.').replace(/]/g, '')
  }

  /**
   * Converts property in `foo.bar` format to HTML form field name in `foo[bar]` format.
   */
  static asFieldName (property): string {
    const parts: string[] = property.split('.')
    return parts[0] + parts.slice(1).map((part: string) => `[${part}]`).join('')
  }
}

export class FormValidationError extends ValidationError {

  /**
   * Field name associated with validated model property.
   */
  fieldName: string

  /**
   * Message associated with first constraint violated of validated model property.
   */
  message: string

  constructor (error: ValidationError, parentProperty?: string) {
    super()
    Object.assign(this, error)

    this.property = parentProperty ? `${parentProperty}.${this.property}` : this.property
    this.fieldName = Converter.asFieldName(this.property)

    const firstConstraintName: string = Object.keys(error.constraints).reverse()[0]
    this.message = error.constraints[firstConstraintName]
  }
}

export class Form<Model> {

  @ValidateNested()
  model: Model
  rawData: object
  errors: FormValidationError[]

  /**
   * @param model - a object used to fill the form
   * @param errors - an array of error objects
   * @param rawData - a raw data used to create model instance
   */
  constructor (model: Model, errors: ValidationError[] = [], rawData: object = undefined) {
    this.model = model
    this.rawData = rawData
    this.errors = this.flatMapDeep(errors)
  }

  static empty<Model> (): Form<Model> {
    return new Form<Model>(undefined, [])
  }

  hasErrors (): boolean {
    return this.errors.length > 0
  }

  /**
   * Get error message associated with first constraint violated for given field name.
   *
   * @param fieldName - field name / model property
   */
  errorFor (fieldName: string): string {
    return this.errors
      .filter((error: FormValidationError) => error.fieldName === fieldName)
      .map((error: FormValidationError) => error.message)[0]
  }

  /**
   * Get raw data for given field name.
   * @param {string} fieldName
   * @returns {object}
   */
  rawDataFor (fieldName: string): object {
    if (this.rawData) {
      return this.getValueFrom(this.rawData, fieldName)
    } else {
      return undefined
    }
  }

  /**
   * Get model value for given field name.
   *
   * @param fieldName - field name / model property
   */
  valueFor (fieldName: string): any | undefined {
    if (this.model) {
      return this.getValueFrom(this.model, fieldName)
    } else {
      return undefined
    }
  }

  /**
   * Iterate though elements of input and find value for field
   * @param {any} input of type model/rawData
   * @param {string} fieldName
   * @returns {object}
   */
  private getValueFrom (input: any, fieldName: string): any {
    let value: any = input

    Converter.asProperty(fieldName).split('.').forEach(property => {
      value = value ? value[property] : value
    })
    return value
  }

  /**
   * Maps array of ValidationError returned by validation framework to FormValidationErrors containing extra form related properties.
   *
   * It also flattens nested structure of ValidationError (see: children property) into flat, one dimension array.
   *
   * @param errors - list of errors
   * @param parentProperty - parent property name
   */
  private flatMapDeep (errors: ValidationError[], parentProperty?: string): FormValidationError[] {
    return _.flattenDeep<FormValidationError>(
      errors.map((error: ValidationError) => {
        if (error.children && error.children.length > 0) {
          return this.flatMapDeep(error.children, parentProperty ? `${parentProperty}.${error.property}` : error.property)
        } else {
          return new FormValidationError(error, parentProperty)
        }
      })
    )
  }
}
