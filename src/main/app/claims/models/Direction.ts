import { Moment } from 'moment'
import * as _ from 'lodash'
import * as DirectionType from 'claims/models/directionType'

export interface Direction {
  directionParty?: string
  directionType?: string
  directionHeaderType?: string
  LocalDate?: Moment
  directionComment?: string
  extraDocuments?: string[]
  expertReports?: string[]
}

export namespace Direction {
  export function deserialize (input: any): Direction[] {
    if (!input) {
      return input
    }

    let directions = []
    _.each(input, function (eachDirection) {
      directions.push({
        directionParty: eachDirection.directionParty,
        directionType: DirectionType[eachDirection.directionType],
        directionHeaderType: eachDirection.directionHeaderType,
        LocalDate: eachDirection.directionHeaderType,
        directionComment: eachDirection.directionHeaderType,
        extraDocuments: eachDirection.directionHeaderType
      })
    })

    return directions
  }
}
