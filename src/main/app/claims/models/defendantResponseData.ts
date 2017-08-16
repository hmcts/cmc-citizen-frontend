import { Serializable } from 'app/models/serializable'

export class DefendantResponseData implements Serializable<DefendantResponseData> {
  type: string
  defence: string
  freeMediation: string

  deserialize (input: any): DefendantResponseData {
    if (input) {
      this.type = input.type
      this.defence = input.defence
      this.freeMediation = input.freeMediation
    }
    return this
  }
}
