import { AgeGroupType } from 'claims/models/response/statement-of-means/dependant'

export namespace AgeGroupTypeViewFilter {
  export function render (value: string): string {
    switch (value) {
      case AgeGroupType.UNDER_11:
        return 'under 11'
      case AgeGroupType.BETWEEN_11_AND_15:
        return '11 to 15'
      case AgeGroupType.BETWEEN_16_AND_19:
        return '16 to 19'
    }
  }
}
