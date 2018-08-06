import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'

export namespace ResidenceTypeViewFilter {
  export function render (value: string): string {
    return ResidenceType.valueOf(value).displayValue
  }
}
